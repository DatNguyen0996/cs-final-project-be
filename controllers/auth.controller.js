const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  //Get data from request
  let { email, password } = req.body;

  // Validation
  let user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "User not found", "Login error");

  //Process
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) throw new AppError(400, "Wrong password", "Login error");
  const accessToken = await user.generateToken();

  //Response
  sendResponse(res, 200, true, { user, accessToken }, null, "Login success");
});

module.exports = authController;
