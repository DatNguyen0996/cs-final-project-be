const express = require("express");
const router = express.Router();
const { loginRequire } = require("../middlewares/authentication");
const { validatorId } = require("../middlewares/validator");
const { createReview, getReview } = require("../controllers/review.controller");

/**
 * @route Get /reviews
 * @description get all review
 * @access public
 */
router.get("/:productId", getReview);

/**
 * @route Post /reviews
 * @description create review
 * @body {}
 * @access public
 */
router.post("/", createReview);

// /**
//  * @route Put /cartI:/cartId
//  * @description update a cart
//  * @body {}
//  * @access login require
//  */
// router.put("/:id", loginRequire, validatorId, updateCart);

// /**
//  * @route Delete /carts:/cartid
//  * @description delete a cart
//  * @access login require
//  */
// router.delete("/:id", loginRequire, validatorId, deleteCart);
module.exports = router;
