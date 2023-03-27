const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const cartController = {};

const limitDefault = process.env.LIMIT;

//add new product to cart
cartController.createCart = catchAsync(async (req, res, next) => {
  //Get data from request
  const { userId, productId, productCode, size, quantity, storeId, price } =
    req.body;

  let filterConditions = [{ isDeleted: false }];
  if (productCode) {
    filterConditions.push({ productCode: productCode });
  }

  if (userId) {
    filterConditions.push({ userId: userId });
  }

  if (size) {
    filterConditions.push({ size: size });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  console.log(filterCriteria);

  // Validation
  let cart = await Cart.findOne(filterCriteria);
  if (cart) {
    throw new AppError(
      400,
      "Sản phẩm đã có trong giỏ hàng",
      "Add to cart Error"
    );
  }

  //process
  cart = await Cart.create({
    userId,
    productId,
    productCode,
    size,
    quantity,
    storeId,
    price,
  });

  //Response
  return sendResponse(res, 200, true, { cart }, null, "Get products success");
});

//Get user  cart
cartController.getCart = catchAsync(async (req, res, next) => {
  //Get data from request
  let { page, limit } = req.query;
  let { userId } = req.params;
  let cartSelect = req.body;

  cartSelect = Object.values(cartSelect).filter(
    (e) => e !== "false" || e !== false
  );

  let filterRender = { _id: { $in: cartSelect } };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;
  //Process
  let filterConditions = [{ isDeleted: false }];
  if (userId) filterConditions.push({ userId: userId });

  if (Object.values(cartSelect).length !== 0)
    filterConditions.push(filterRender);

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  console.log(filterCriteria);
  const countCart = await Cart.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countCart / limit);
  const offset = limit * (page - 1);

  const carts = await Cart.find(filterCriteria)
    .populate("productId")
    .populate("storeId")
    .sort({ createdAt: 1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { carts, totalPage, countCart },
    null,
    "Get products success"
  );
});

//Update a product

cartController.updateCart = catchAsync(async (req, res, next) => {
  //Get data from request
  const updateInfor = req.body;
  const targetId = req.params.id;
  const options = { new: true };
  //Validation

  let fieldAllow = ["quantity"];

  if (Object.keys(updateInfor).length !== 0) {
    fieldAllow = fieldAllow.filter((field) =>
      Object.keys(updateInfor).includes(field)
    );
    if (fieldAllow.length === 0)
      throw new AppError(400, "Not Allow to Update", "Update product error");
  } else {
    throw new AppError(400, "No update information", "Update product error");
  }

  const cart = await Cart.findByIdAndUpdate(targetId, updateInfor, options);

  //Response
  return sendResponse(
    res,
    200,
    true,
    { cart },
    null,
    "Update a product success"
  );
});

//Delete a product
cartController.deleteCart = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetId = req.params.id;
  const options = { new: true };
  const deleteInfor = { isDeleted: true };

  //process
  const cart = await Cart.findByIdAndUpdate(targetId, deleteInfor, options);

  //Response
  return sendResponse(res, 200, true, { cart }, null, "Delete product success");
});

module.exports = cartController;
