const express = require("express");
const router = express.Router();
const { loginRequire } = require("../middlewares/authentication");
const { validatorId } = require("../middlewares/validator");
const {
  getProductsOfAllStore,
  getProductOfOneStore,
  createProductsOfStore,
  updateProductsOfStore,
  deleteProductsOfStore,
} = require("../controllers/productsOfStore.controller");

/**
 * @route Get /stores?page=1&limit=10&name=<storename>
 * @description get all stores
 * @access public
 */
router.get("/", getProductsOfAllStore);

/**
 * @route Get /stores?page=1&limit=10&name=<storename>
 * @description get all stores
 * @access public
 */
router.get("/allproduct", getProductOfOneStore);

/**
 * @route Post /stores
 * @description create a new store
 * @body {name, email, password}
 * @access public
 */
router.post("/", loginRequire, createProductsOfStore);

/**
 * @route Put /stores/:storeid
 * @description update store infomation
 * @body {productId}
 * @access public
 */
router.put("/:id", loginRequire, validatorId, updateProductsOfStore);

/**
 * @route Delete /stores/:storeid
 * @description delete a store
 * @access public
 */
router.delete("/:id", loginRequire, validatorId, deleteProductsOfStore);

module.exports = router;
