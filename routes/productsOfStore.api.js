const express = require("express");
const router = express.Router();
const { loginRequire } = require("../middlewares/authentication");
const { validatorId } = require("../middlewares/validator");
const { adminOrManagerCheck } = require("../middlewares/permission");
const {
  getProductsOfAllStore,
  getProductOfOneStore,
  createProductsOfStore,
  updateProductsOfStore,
  deleteProductsOfStore,
} = require("../controllers/productsOfStore.controller");

/**
 * @route Get
 * @description
 * @access public
 */
router.get("/", getProductsOfAllStore);

/**
 * @route Get
 * @description
 * @access public
 */
router.get("/allproduct", getProductOfOneStore);

/**
 * @route Post
 * @description
 * @body
 * @access public
 */
router.post("/", loginRequire, adminOrManagerCheck, createProductsOfStore);

/**
 * @route Put
 * @description
 * @body
 * @access public
 */
router.put(
  "/:id",
  loginRequire,
  adminOrManagerCheck,
  validatorId,
  updateProductsOfStore
);

/**
 * @route Delete
 * @description delete
 * @access public
 */
router.delete(
  "/:id",
  loginRequire,
  adminOrManagerCheck,
  validatorId,
  deleteProductsOfStore
);

module.exports = router;
