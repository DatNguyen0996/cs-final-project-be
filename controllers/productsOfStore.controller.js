const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const ProductsOfStore = require("../models/ProductsOfStore");
const Product = require("../models/Product");
const productsOfStoreController = {};
const limitDefault = process.env.LIMIT;

//Get all product of store
productsOfStoreController.getProductsOfAllStore = catchAsync(
  async (req, res, next) => {
    //Get data from request
    let { page, limit } = req.query;
    let { productId, storeId } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || limitDefault;
    //Process
    let filterConditions = [{ isDeleted: false }];

    if (productId) {
      filterConditions.push({ product: productId });
    }

    if (storeId) {
      filterConditions.push({ store: storeId });
    }

    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};
    console.log(filterCriteria);
    const countProductsOfAllStore = await ProductsOfStore.countDocuments(
      filterCriteria
    );
    const totalPage = Math.ceil(countProductsOfAllStore / limit);
    const offset = limit * (page - 1);
    const productsOfAllStore = await ProductsOfStore.find(filterCriteria)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("store");
    console.log(filterCriteria);
    //Response
    if (productsOfAllStore.length === 0) {
      throw new AppError(
        400,
        "Không tìm được sản phẩm nảo",
        "get product error"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      {
        productsOfAllStore,
        totalPage,
        countProductsOfAllStore,
      },
      null,
      "Get all product success"
    );
  }
);

//Get all product of one store
productsOfStoreController.getProductOfOneStore = catchAsync(
  async (req, res, next) => {
    //Get data from request
    let { page, limit, storeId, productCode } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || limitDefault;
    storeId = storeId || "";
    productCode = productCode || "";

    let productOfOneStore = [];
    let countProductOfOneStore = 0;
    let totalPage = 0;
    //Process
    let filterConditions = [{ isDeleted: false }];

    if (storeId !== "") {
      filterConditions.push({ store: storeId });
    } else {
      return sendResponse(
        res,
        200,
        true,
        { productOfOneStore, totalPage, countProductOfOneStore },
        null,
        "Not found Product of store"
      );
    }

    if (productCode !== "") {
      filterConditions.push({ productCode: productCode });
    }

    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};

    countProductOfOneStore = await ProductsOfStore.countDocuments(
      filterCriteria
    );
    totalPage = Math.ceil(countProductOfOneStore / limit);
    const offset = limit * (page - 1);
    productOfOneStore = await ProductsOfStore.find(filterCriteria)
      .populate("product")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    //Response

    if (productOfOneStore.length === 0) {
      return sendResponse(
        res,
        200,
        true,
        { productOfOneStore, totalPage, countProductOfOneStore },
        null,
        "Not found Product of store"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      { productOfOneStore, totalPage, countProductOfOneStore },
      null,
      "Get all product of store success"
    );
  }
);

//Create a new wareHouse
productsOfStoreController.createProductsOfStore = catchAsync(
  async (req, res, next) => {
    //Get data from request
    let { store, productType, productCode, productSize, quantity } = req.body;
    store = store || "";
    productCode = productCode || "";
    quantity = quantity || "";
    productType = productType || "";

    if (productType === "racket" || productType === "accessory") {
      productSize = "";
    } else {
      productSize = productSize || "";
    }
    //

    let filterConditions = [{ isDeleted: false }];

    if (productCode !== "") {
      filterConditions.push({ productCode: productCode });
    }

    if (productSize !== "") {
      filterConditions.push({ productSize: productSize });
    }

    if (store !== "") {
      filterConditions.push({ store: store });
    }

    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};
    let productCheck = await Product.findOne({
      $and: [
        { isDeleted: false },
        { code: productCode },
        { productType: productType },
      ],
    });
    if (!productCheck) {
      throw new AppError(
        400,
        "Sản phẩm không tồn tại trên hệ thống",
        "Create Error"
      );
    }

    let productsOfStore = await ProductsOfStore.findOne(filterCriteria);
    console.log(filterCriteria);
    if (productsOfStore) {
      throw new AppError(
        400,
        "Sản phẩm đã tồn tại trong cửa hàng",
        "Create Error"
      );
    }

    //Process
    productsOfStore = await ProductsOfStore.create({
      store,
      product: productCheck._id,
      productCode,
      productSize,
      quantity,
    });

    //Response
    return sendResponse(
      res,
      200,
      true,
      { productsOfStore },
      null,
      "Create product Of Store success"
    );
  }
);

//Update a wareHouse
productsOfStoreController.updateProductsOfStore = catchAsync(
  async (req, res, next) => {
    //Get data from request
    const updateInfor = req.body;
    const targetId = req.params.id;
    const options = { new: true };

    //Validation
    if (Object.keys(updateInfor).length === 0)
      throw new AppError(400, "No infomation to update", "Update eror");

    let updateAllow = ["weight", "size", "quantity"];
    updateAllow = updateAllow.filter((field) =>
      Object.keys(updateInfor).includes(field)
    );
    if (updateAllow.length === 0)
      throw new AppError(400, "Not allow to update", "Update eror");

    //Process

    const productsOfStore = await ProductsOfStore.findByIdAndUpdate(
      targetId,
      updateInfor,
      options
    );
    if (!productsOfStore)
      throw new AppError(400, "product of store not found", "Update eror");

    //Response
    return sendResponse(
      res,
      200,
      true,
      { productsOfStore },
      null,
      "Update product of store success"
    );
  }
);

//Delete a wareHouse
productsOfStoreController.deleteProductsOfStore = catchAsync(
  async (req, res, next) => {
    //Get data from request
    const targetId = req.params.id;
    const options = { new: true };
    const deleteInfor = { isDeleted: true };

    //process
    const productsOfStore = await ProductsOfStore.findByIdAndUpdate(
      targetId,
      deleteInfor,
      options
    );
    //Response
    return sendResponse(
      res,
      200,
      true,
      { productsOfStore },
      null,
      "Delete product of store success"
    );
  }
);

// wareHouse
module.exports = productsOfStoreController;
