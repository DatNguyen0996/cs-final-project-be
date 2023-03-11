const express = require("express");
const router = express.Router();
const { loginRequire } = require("../middlewares/authentication");
const {
  validatorId,
  validatorCreateStore,
  validatorUpdateStore,
} = require("../middlewares/validator");
const {
  getStores,
  getSingleStore,
  createStore,
  updateStore,
  deleteStore,
} = require("../controllers/store.controller");

/**
 * @route Get /stores?page=1&limit=10&name=<storename>
 * @description get all stores
 * @access public
 */
router.get("/", getStores);

/**
 * @route Get /stores/:storeid
 * @description get gingle store by ID
 * @access public
 */
router.get("/:id", loginRequire, validatorId, getSingleStore);

/**
 * @route Post /stores
 * @description create a new store
 * @body {name, email, password}
 * @access public
 */
router.post("/", loginRequire, validatorCreateStore, createStore);

/**
 * @route Put /stores/:storeid
 * @description update store infomation
 * @body {productId}
 * @access public
 */
router.put(
  "/:id",
  loginRequire,
  validatorId,
  validatorUpdateStore,
  updateStore
);

/**
 * @route Delete /stores/:storeid
 * @description delete a store
 * @access public
 */
router.delete("/:id", loginRequire, validatorId, deleteStore);

module.exports = router;
