const express = require("express");
const router = express.Router();
const {
  register,
  getUsers,
  getCurrentUser,
  getSingltUser,
  updateUser,
} = require("../controllers/user.controller");
const { validatorUser, validatorId } = require("../middlewares/validator");
const { loginRequire } = require("../middlewares/authentication");

/**
 * @route Get /users?page=1&limit=10&name=<username>
 * @description get all users
 * @access public
 */
router.get("/", loginRequire, getUsers);

/**
 * @route Get /users/me
 * @description get all users
 * @access public
 */
router.get("/me", loginRequire, getCurrentUser);

/**
 * @route Get /users/:userid
 * @description get gingle user by ID
 * @access public
 */
router.get("/:id", loginRequire, validatorId, getSingltUser);

/**
 * @route Post /users
 * @description register a new account for customer
 * @body {name, email, password}
 * @access public
 */
router.post("/", validatorUser, register);

/**
 * @route Put /users/:userid
 * @description add a product to customer's cart
 * @body {productId}
 * @access public
 */
router.put("/:id", loginRequire, validatorId, updateUser);

/**
 * @route Delete /users/:userid
 * @description delete a user
 * @access public
 */

module.exports = router;
