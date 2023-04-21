const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const userController = {};
const limitDefault = process.env.LIMIT;

//Create a new user
userController.register = catchAsync(async (req, res, next) => {
  //Get data from request
  let { name, email, password, role, address } = req.body;
  name = name.toLowerCase();

  // Validation
  let user = await User.findOne({ email });
  if (user) {
    throw new AppError(400, "Tài khoản đã tồn tại", "Registration Error");
  }

  let accessToken = null;
  let tokenRole = null;
  if (role === "manager") {
    throw new AppError(
      400,
      "Can't create an account as manager",
      "Access denied"
    );
  }
  if (role === "customer") {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({ name, email, password, role, address });
    accessToken = await user.generateToken();
  }
  if (role === "employee") {
    const tokenString = req.headers.authorization;
    if (!tokenString)
      throw new AppError(401, "Login require", "Authntication error");
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError(401, "Token expired", "Authntication error");
        } else {
          throw new AppError(401, "Token is invalid", "Authntication error");
        }
      }
      tokenRole = payload.role;
    });
    if (tokenRole !== "manager") {
      throw new AppError(
        400,
        "Account is not permission for this feature-access as Manager",
        "permission Error"
      );
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({ name, email, password, role, address });
    accessToken = await user.generateToken();
  }

  // //Process
  // const salt = await bcrypt.genSalt(10);
  // password = await bcrypt.hash(password, salt);
  // user = await User.create({ name, email, password, role, address });
  // const accessToken = await user.generateToken();

  //Response
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Register Success"
  );
});

//Get all users
userController.getUsers = catchAsync(async (req, res, next) => {
  //Get data from request
  let { page, limit, name, role } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || limitDefault;

  // Validation

  let filterConditions = [{ isDelete: false }, { new: true }];
  if (name) {
    filterConditions.push({ name: { $regex: name, $options: "i" } });
  }

  if (role) {
    filterConditions.push({ role: role });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const countUsers = await User.countDocuments(filterCriteria);
  const totalPage = Math.ceil(countUsers / limit);
  const offset = limit * (page - 1);
  const users = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);
  if (!users) throw new AppError(400, "Users not found", "Get user Error");

  //Response
  return sendResponse(
    res,
    200,
    true,
    { users, totalPage, countUsers },
    null,
    "Get user Success"
  );
});

//Get current user
userController.getCurrentUser = catchAsync(async (req, res, next) => {
  //Get data from request
  const currentUserId = req.userId;

  // Validation
  const currentUser = await User.findById(currentUserId);
  if (!currentUser)
    throw new AppError(400, "User not found", "Get current user Error");

  //Process

  //Response
  return sendResponse(
    res,
    200,
    true,
    { currentUser },
    null,
    "Get user Success"
  );
});

//Get single user by Id
userController.getSingltUser = catchAsync(async (req, res, next) => {
  //Get data from request
  const { id } = req.params;

  //Validation
  const user = await User.findById(id).populate([
    "cart.product",
    "orders.order",
  ]);
  if (!user) throw new AppError(400, "User not found", "Get user Error");
  //Response
  return sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "Get single user success"
  );
});

//Update user infor
userController.updateUser = catchAsync(async (req, res, next) => {
  //Get data from request
  const { id } = req.params;
  const updateInfor = req.body;
  const options = { new: true };

  //Validation
  let updateAllow = [
    "name",
    "avatar",
    "password",
    "phone",
    "address",
    "gender",
    "dayOfBirth",
  ];
  updateAllow = updateAllow.filter((field) =>
    Object.keys(updateInfor).includes(field)
  );
  if (updateAllow.length === 0)
    throw new AppError(400, "Not allow to update", "Update eror");
  console.log(updateInfor);
  //Process
  const user = await User.findByIdAndUpdate(id, updateInfor, options);
  if (!user) throw new AppError(400, "User not found", "Get user Error");
  //Response
  return sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "Get single user success"
  );
});

module.exports = userController;
