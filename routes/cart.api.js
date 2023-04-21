const express = require("express");
const router = express.Router();
const { loginRequire } = require("../middlewares/authentication");
const { adminOrManagerCheck } = require("../middlewares/permission");
const { validatorId } = require("../middlewares/validator");
const {
  getCart,
  createCart,
  updateCart,
  deleteCart,
} = require("../controllers/cart.controller");

/**
 * @route Get /carts
 * @description get all cart
 * @access public
 */
router.get("/:userId", loginRequire, getCart);

/**
 * @route Post /carts
 * @description create cart
 * @body {}
 * @access public
 */
router.post("/", createCart);

/**
 * @route Put /cartI:/cartId
 * @description update a cart
 * @body {}
 * @access login require
 */
router.put("/:id", loginRequire, adminOrManagerCheck, validatorId, updateCart);

/**
 * @route Delete /carts:/cartid
 * @description delete a cart
 * @access login require
 */
router.delete("/:id", loginRequire, validatorId, deleteCart);
module.exports = router;
