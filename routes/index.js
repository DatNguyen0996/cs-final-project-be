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

// wareHouse api
const productsOfStoreApi = require("./productsOfStore.api");
router.use("/productsOfStore", productsOfStoreApi);

// cart api
const cartApi = require("./cart.api");
router.use("/carts", cartApi);

// review api
const reviewApi = require("./review.api");
router.use("/reviews", reviewApi);

// review api
const contactApi = require("./contact.api");
router.use("/contacts", contactApi);

module.exports = router;
