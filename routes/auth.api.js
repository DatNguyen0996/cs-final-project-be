const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { validatorAuth } = require("../middlewares/validator");

/**
 * @route Post /login
 * @description login with email and password
 * @body {email, password}
 * @access public
 */

router.post("/login", validatorAuth, authController.loginWithEmail);

module.exports = router;
