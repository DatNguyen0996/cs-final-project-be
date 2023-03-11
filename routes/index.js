const express = require("express");
const router = express.Router();

// Auth api
const authApi = require("./auth.api");
router.use("/auth", authApi);

// Users api
const usersApi = require("./users.api");
router.use("/users", usersApi);

// Stores api
const storesApi = require("./stores.api");
router.use("/stores", storesApi);

// Orders api
const ordersApi = require("./orders.api");
router.use("/orders", ordersApi);

// Products api
const productsApi = require("./products.api");
router.use("/products", productsApi);

module.exports = router;
