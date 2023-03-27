const express = require("express");
const router = express.Router();
const { loginRequire } = require("../middlewares/authentication");
const { validatorId } = require("../middlewares/validator");
const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  filterProduct,
  deleteProduct,
} = require("../controllers/product.controller");

/**
 * @route Get /products?page=1&limit=10&name=<product name>
 * @description get all product
 * @access public
 */
router.get("/", getProducts);

/**
 * @route Get /products/:productid
 * @description get gingle product by ID
 * @access login require
 */
router.get("/:id", validatorId, getSingleProduct);

/**
 * @route Post /products/filter
 * @description filter product
 * @access public
 */
router.post("/filter", filterProduct);

/**
 * @route Post /products
 * @description create a new product
 * @body {}
 * @access login require
 */
router.post("/", loginRequire, createProduct);

/**
 * @route Put /products:/productid
 * @description update a product
 * @body {}
 * @access login require
 */
router.put("/:id", loginRequire, validatorId, updateProduct);

/**
 * @route Delete /products:/productid
 * @description delete a product
 * @access login require
 */
router.delete("/:id", loginRequire, validatorId, deleteProduct);
module.exports = router;
