const express = require("express");
const router = express.Router();
const { loginRequire } = require("../middlewares/authentication");
const { validatorId } = require("../middlewares/validator");
const {
  getOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");

/**
 * @route Get /orders?page=1&limit=10
 * @description get all order
 * @access public
 */
router.get("/", getOrders);

/**
 * @route Get /orders/:orderid
 * @description get gingle order by ID
 * @access public
 */
router.get("/:id", loginRequire, validatorId, getSingleOrder);

/**
 * @route Post /orders
 * @description create a new order
 * @body {}
 * @access login require
 */
router.post("/", loginRequire, createOrder);

/**
 * @route Put /orders:/orderid
 * @description update a order
 * @body {}
 * @access login require
 */
router.put("/:id", loginRequire, validatorId, updateOrder);

/**
 * @route Delete /orders:/orderid
 * @description delete a order
 * @access login require
 */
router.delete("/:id", loginRequire, validatorId, deleteOrder);

module.exports = router;
