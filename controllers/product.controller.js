const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Product = require("../models/Product");
const productController = {};

//Create a new product
productController.createProduct = catchAsync(async (req, res, next) => {
  //Get data from request
  const productInfor = req.body;

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

  if (Object.keys(productInfor).length !== 0) {
    fieldAllow = fieldAllow.filter((field) =>
      Object.keys(productInfor).includes(field)
    );
    if (fieldAllow.length === 0)
      throw new AppError(400, "Not allow to create", "Create product error");
  }

  const product = await Product.create(productInfor);

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
  let { page, limit, productName } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  //Process
  let filterConditions = [{ isDeleted: false }];
  if (productName)
    filterConditions.push({ name: { $regex: productName, $options: "i" } });

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const countProducts = await Product.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countProducts / limit);
  const offset = limit * (page - 1);
  const products = await Product.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  if (products.length === 0)
    throw new AppError(400, "Product not found", "Get products error");
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
