const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Order = require("../models/Order");
const orderController = {};
const limitDefault = process.env.LIMIT;

//Get all order
orderController.getOrders = catchAsync(async (req, res, next) => {
  //Get data from request
  let { page, limit, orderName } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;
  //Process
  let filterConditions = [{ isDeleted: false }];
  if (orderName)
    filterConditions.push({ name: { $regex: orderName, $options: "i" } });

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const countOrders = await Order.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countOrders / limit);
  const offset = limit * (page - 1);
  const orders = await Order.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  if (orders.length === 0)
    throw new AppError(400, "Orders not found", "Get orders error");
  //Response
  return sendResponse(
    res,
    200,
    true,
    { orders, totalPage, countOrders },
    null,
    "Get orders success"
  );
});

//Get single order by ID
orderController.getSingleOrder = catchAsync(async (req, res, next) => {
  //Get data from request
  const { id } = req.params;
  //Process
  const order = await Order.findById(id);

  if (!order)
    throw new AppError(400, "Order not found", "Get single order error");

  //Response
  return sendResponse(res, 200, true, { order }, null, "Get order success");
});

//Get all order of current user
orderController.getOrderOfUserMe = catchAsync(async (req, res, next) => {
  //Get data from request
  const { id } = req.params;
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;

  //Process
  let filterConditions = [{ isDeleted: false }];
  if (id) filterConditions.push({ userId: id });

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  //Process
  const countOrders = await Order.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countOrders / limit);
  const offset = limit * (page - 1);
  const orders = await Order.find(filterCriteria)
    .populate("items.product")
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  if (orders.length === 0)
    throw new AppError(400, "Orders not found", "Get orders error");

  //Response
  return sendResponse(
    res,
    200,
    true,
    { orders, totalPage, countOrders },
    null,
    "Get orders success"
  );
});

//Get all order of store
orderController.getOrderOfStore = catchAsync(async (req, res, next) => {
  //Get data from request
  const { id } = req.params;
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;

  //Process
  let filterConditions = [{ isDeleted: false }];
  if (id) filterConditions.push({ storeId: id });

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  //Process
  const countOrders = await Order.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countOrders / limit);
  const offset = limit * (page - 1);
  const orders = await Order.find(filterCriteria)
    .populate("items.product")
    .sort({ createdAt: 1 })
    .skip(offset)
    .limit(limit);

  // if (orders.length === 0)
  //   throw new AppError(400, "Orders not found", "Get orders error");

  //Response
  return sendResponse(
    res,
    200,
    true,
    { orders, totalPage, countOrders },
    null,
    "Get orders success"
  );
});

//Create a new order
orderController.createOrder = catchAsync(async (req, res, next) => {
  //Get data from request
  const orderInfor = req.body;
  console.log(orderInfor);
  //Validation

  const order = await Order.create(orderInfor);

  //Response
  return sendResponse(res, 200, true, { order }, null, "Create order success");
});

//Update a order
orderController.updateOrder = catchAsync(async (req, res, next) => {
  //Get data from request
  const updateInfor = req.body;
  const targetId = req.params.id;
  const options = { new: true };

  const order = await Order.findByIdAndUpdate(targetId, updateInfor, options);

  //Response
  return sendResponse(res, 200, true, { order }, null, "Update order success");
});

//Delete a order
orderController.deleteOrder = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetId = req.params.id;
  const options = { new: true };
  const deleteInfor = { isDeleted: true };

  //process
  const order = await Order.findByIdAndUpdate(targetId, deleteInfor, options);
  //Response
  return sendResponse(res, 200, true, { order }, null, "Delete order success");
});

module.exports = orderController;
