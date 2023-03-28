const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Contact = require("../models/Contact");
const contactController = {};
const limitDefault = process.env.LIMIT;

//Get all store
contactController.getContact = catchAsync(async (req, res, next) => {
  //Get data from request
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;

  //Process
  const filterCriteria = { isDeleted: false };

  const countContact = await Contact.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countContact / limit);
  const offset = limit * (page - 1);
  const contacts = await Contact.find(filterCriteria)
    .sort({ createdAt: 1 })
    .skip(offset)
    .limit(limit);

  //Response
  return sendResponse(
    res,
    200,
    true,
    { contacts, totalPage, countContact },
    null,
    "Get contacts success"
  );
});

//Create a new store
contactController.createContact = catchAsync(async (req, res, next) => {
  //Get data from request
  const contactInfor = req.body;

  //Process

  const contact = await Contact.create(contactInfor);

  //Response
  return sendResponse(
    res,
    200,
    true,
    { contact },
    null,
    "Create contact success"
  );
});

module.exports = contactController;
