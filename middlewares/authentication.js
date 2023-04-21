const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils");

const authentication = {};
authentication.loginRequire = (req, res, next) => {
  try {
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
      req.userId = payload._id;
      req.permission = payload.role;
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
