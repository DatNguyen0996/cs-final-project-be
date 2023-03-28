const express = require("express");
const router = express.Router();
const { loginRequire } = require("../middlewares/authentication");
const { validatorId } = require("../middlewares/validator");
const {
  getContact,
  createContact,
} = require("../controllers/contact.controller");

/**
 * @route Get /contact
 * @description get all contact
 * @access public
 */
router.get("/", getContact);

/**
 * @route Post /contact
 * @description create contact
 * @body {}
 * @access public
 */
router.post("/", createContact);

module.exports = router;
