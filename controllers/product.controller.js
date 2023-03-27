const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Product = require("../models/Product");
const productController = {};

const limitDefault = process.env.LIMIT;

//Create a new product
productController.createProduct = catchAsync(async (req, res, next) => {
  //Get data from request
  const productInfor = req.body;

  //Validation
  let fieldAllow = [
    "name",
    "productType",
    "image",
    "code",
    "brand",
    "price",
    "special",
    "levelOfPlay",
    "formality",
    "playStyle",
    "hardness",
    "balancedPoint",
    "weight",
    "level",
    "description",
    "gender",
    "size",
    "saleOff",
  ];

  // const countProducts = await Product.countDocuments({
  //   productType: productInfor.productType,
  // });

  // let code;

  // const codeValue = [
  //   { racket: "A" },
  //   { shoe: "B" },
  //   { shirt: "C" },
  //   { shorts: "D" },
  //   { sportDress: "E" },
  //   { accessory: "F" },
  // ];

  // codeValue.map((e) => {
  //   Object.keys(e)[0] === productInfor.productType
  //     ? (code = `P-${Object.values(e)[0]}-${countProducts + 1}`)
  //     : code;
  // });

  if (Object.keys(productInfor).length !== 0) {
    fieldAllow = fieldAllow.filter((field) =>
      Object.keys(productInfor).includes(field)
    );
    if (fieldAllow.length === 0)
      throw new AppError(400, "Not allow to create", "Create product error");
  }

  const createData = { ...productInfor };

  const product = await Product.create(createData);

  //Response
  return sendResponse(
    res,
    200,
    true,
    { product },
    null,
    "Get products success"
  );
});

//Get all product
productController.getProducts = catchAsync(async (req, res, next) => {
  //Get data from request
  let { page, limit, productName, productType, productCode, special } =
    req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;
  //Process
  let filterConditions = [{ isDeleted: false }];
  if (productName)
    filterConditions.push({ name: { $regex: productName, $options: "i" } });

  if (productCode) filterConditions.push({ code: productCode });

  if (productType) {
    if (productType !== "all") {
      filterConditions.push({ productType: productType });
    }
  }

  if (special) filterConditions.push({ special: special });

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  // console.log(filterCriteria);

  const countProducts = await Product.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countProducts / limit);
  const offset = limit * (page - 1);

  const products = await Product.find(filterCriteria)
    .sort({ createdAt: 1 })
    .skip(offset)
    .limit(limit);

  // if (products.length === 0)
  //   throw new AppError(400, "Product not found", "Get products error");
  //Response
  return sendResponse(
    res,
    200,
    true,
    { products, totalPage, countProducts },
    null,
    "Get products success"
  );
});

//Get single product by ID

productController.getSingleProduct = catchAsync(async (req, res, next) => {
  //Get data from request
  const { id } = req.params;
  //Process
  const product = await Product.findById(id);

  if (!product)
    throw new AppError(400, "Product not found", "Get single product error");

  //Response
  return sendResponse(
    res,
    200,
    true,
    { product },
    null,
    "Get a product success"
  );
});

//Update a product

productController.updateProduct = catchAsync(async (req, res, next) => {
  //Get data from request
  const updateInfor = req.body;
  const targetId = req.params.id;
  const options = { new: true };
  //Validation

  let fieldAllow = [
    "name",
    "image",
    "code",
    "brand",
    "price",
    "special",
    "levelOfPlay",
    "formality",
    "playStyle",
    "hardness",
    "balancedPoint",
    "weight",
    "level",
    "description",
    "gender",
  ];

  if (Object.keys(updateInfor).length !== 0) {
    fieldAllow = fieldAllow.filter((field) =>
      Object.keys(updateInfor).includes(field)
    );
    if (fieldAllow.length === 0)
      throw new AppError(400, "Not Allow to Update", "Update product error");
  } else {
    throw new AppError(400, "No update information", "Update product error");
  }
  const product = await Product.findByIdAndUpdate(
    targetId,
    updateInfor,
    options
  );

  //Response
  return sendResponse(
    res,
    200,
    true,
    { product },
    null,
    "Update a product success"
  );
});

//filter product
productController.filterProduct = catchAsync(async (req, res, next) => {
  //Get data from request
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;

  // if (special) filterConditions.push({ special: special });

  const { productType, price, brand, special, name } = req.body;
  console.log({ productType, price, brand });

  let filterConditions = [{ isDeleted: false }];

  let addFilterPrice = [];

  if (price !== undefined) {
    if (price?.length !== 0 && price) {
      price.map((el) => {
        if (el === "priceLevelOne") {
          addFilterPrice.push({ price: { $lt: 500000 } });
        } else if (el === "priceLevelTwo") {
          addFilterPrice.push({
            $and: [{ price: { $gte: 500000 } }, { price: { $lt: 1000000 } }],
          });
        } else if (el === "priceLevelThree") {
          addFilterPrice.push({
            $and: [{ price: { $gte: 1000000 } }, { price: { $lt: 2000000 } }],
          });
        } else if (el === "priceLevelFour") {
          addFilterPrice.push({
            $and: [{ price: { $gte: 2000000 } }, { price: { $lt: 3000000 } }],
          });
        } else {
          addFilterPrice.push({ price: { $gt: 3000000 } });
        }
      });
    }
  }

  const filterPrice = addFilterPrice.length ? { $or: addFilterPrice } : {};

  if (addFilterPrice.length) {
    filterConditions = [...filterConditions, filterPrice];
  }

  if (productType !== undefined) {
    if (productType.length !== 0 && productType)
      filterConditions.push({ productType: { $in: productType } });
  }

  if (brand !== undefined) {
    if (brand.length !== 0 && brand)
      filterConditions.push({ brand: { $in: brand } });
  }

  if (special) filterConditions.push({ special: special });

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  if (name) filterConditions.push({ name: { $regex: name, $options: "i" } });

  //process
  const countProducts = await Product.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countProducts / limit);
  const offset = limit * (page - 1);

  const products = await Product.find(filterCriteria)
    .sort({ createdAt: 1 })
    .skip(offset)
    .limit(limit);

  console.log(totalPage, countProducts);
  //Response
  return sendResponse(
    res,
    200,
    true,
    { products, totalPage, countProducts },
    null,
    "Filter a product success"
  );
});

//Delete a product
productController.deleteProduct = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetId = req.params.id;
  const options = { new: true };
  const deleteInfor = { isDeleted: true };

  //process
  const product = await Product.findByIdAndUpdate(
    targetId,
    deleteInfor,
    options
  );

  //Response
  return sendResponse(
    res,
    200,
    true,
    { product },
    null,
    "Delete product success"
  );
});

module.exports = productController;
