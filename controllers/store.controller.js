const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Store = require("../models/Store");
const storeController = {};

//Get all store
storeController.getStores = catchAsync(async (req, res, next) => {
  //Get data from request
  let { page, limit, storeName } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  //Process
  let filterConditions = [{ isDeleted: false }];
  if (storeName)
    filterConditions.push({ name: { $regex: storeName, $options: "i" } });

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const countStores = await Store.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countStores / limit);
  const offset = limit * (page - 1);
  const stores = await Store.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  if (stores.length === 0)
    throw new AppError(400, "Stores not found", "Get Stores error");

  //Response
  return sendResponse(
    res,
    200,
    true,
    { stores, totalPage, countStores },
    null,
    "Get stores success"
  );
});

//Get single store by ID
storeController.getSingleStore = catchAsync(async (req, res, next) => {
  //Get data from request
  const { id } = req.params;

  //Process
  const store = await Store.findById(id);

  if (!store)
    throw new AppError(400, "Store not found", "Get single store error");

  //Response
  return sendResponse(
    res,
    200,
    true,
    { store },
    null,
    "Get single store success"
  );
});

//Create a new store
storeController.createStore = catchAsync(async (req, res, next) => {
  //Get data from request
  const storeInfor = req.body;

  //Process

  const store = await Store.create(storeInfor);

  //Response
  return sendResponse(res, 200, true, { store }, null, "Create store success");
});

//Update a store
storeController.updateStore = catchAsync(async (req, res, next) => {
  //Get data from request
  const updateInfor = req.body;
  const targetId = req.params.id;
  const options = { new: true };

  //Validation
  if (Object.keys(updateInfor).length === 0)
    throw new AppError(400, "No infomation to update", "Update eror");

  let updateAllow = ["name", "phone", "address", "administrator"];
  updateAllow = updateAllow.filter((field) =>
    Object.keys(updateInfor).includes(field)
  );
  if (updateAllow.length === 0)
    throw new AppError(400, "Not allow to update", "Update eror");

  //Process
  const store = await Store.findByIdAndUpdate(targetId, updateInfor, options);
  if (!store) throw new AppError(400, "Store not found", "Update eror");

  //Response
  return sendResponse(res, 200, true, { store }, null, "Update store success");
});

//Delete a store
storeController.deleteStore = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetId = req.params.id;
  const options = { new: true };
  const deleteInfor = { isDeleted: true };

  //process
  const store = await Store.findByIdAndUpdate(targetId, deleteInfor, options);
  //Response
  return sendResponse(res, 200, true, { store }, null, "Delete store success");
});

// store
module.exports = storeController;
