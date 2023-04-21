const { sendResponse, AppError } = require("../helpers/utils");

const permission = {};

permission.adminOrManagerCheck = (req, res, next) => {
  const { permission } = req;
  console.log(permission);
  if (permission === "employee" || permission === "manager") {
    next();
  } else {
    throw new AppError(
      400,
      "Account is not permission for this feature-access as Admin or Manager",
      "permission Error"
    );
  }
};

permission.managerCheck = (req, res, next) => {
  const { permission } = req;
  console.log(permission);
  if (permission === "manager") {
    next();
  } else {
    throw new AppError(
      400,
      "Account is not permission for this feature-access as Manager",
      "permission Error"
    );
  }
};
module.exports = permission;
