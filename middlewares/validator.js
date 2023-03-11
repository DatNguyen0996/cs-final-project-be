const { body, check } = require("express-validator");
const { sendResponse } = require("../helpers/utils");
const { validationResult } = require("express-validator");

const validator = {};

//Check and send error
const checkError = async (validationArray, req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");
  return sendResponse(res, 422, false, { message }, "Validation error");
};

//validate data register
validator.validatorUser = (req, res, next) => {
  const validationArray = [
    body("name", "Name is require").notEmpty(),

    body("email", "Email is require").notEmpty(),
    body("email", "Invalid email").isEmail(),

    body("password", "Password is require").notEmpty(),
  ];
  checkError(validationArray, req, res, next);
};

//validate data register user
validator.validatorAuth = (req, res, next) => {
  const validationArray = [
    body("email", "Email is require").notEmpty(),
    body("email", "Invalid email").isEmail(),

    body("password", "Password is require").notEmpty(),
  ];
  checkError(validationArray, req, res, next);
};

//validate ID
validator.validatorId = (req, res, next) => {
  const validationArray = [
    check("id", "User ID must be a MongoDB ObjectId").isMongoId(),
    // param("userId", "User ID must be a MongoDB ObjectId").isMongoId(),
  ];
  checkError(validationArray, req, res, next);
};

//validate data create store
validator.validatorCreateStore = (req, res, next) => {
  const validationArray = [
    body("name", "Name is require").notEmpty(),
    body("address", "Address is require").notEmpty(),
  ];
  checkError(validationArray, req, res, next);
};

//validate data update store
validator.validatorUpdateStore = (req, res, next) => {
  const validationArray = [
    body(
      "administrator",
      "Administrator must be a MongoDB ObjectId"
    ).isMongoId(),
  ];
  checkError(validationArray, req, res, next);
};

module.exports = validator;
