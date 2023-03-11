const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    name: { type: String, default: "Bedminton Store" },

    customerID: { type: Number, default: null, require: true },

    phone: { type: Number, default: null, require: true },

    address: { type: String, default: "" },

    storeID: { type: Number, default: null, require: true },

    items: { type: Object, default: {} },

    totalItems: { type: Number, default: null, require: true },

    totalPrice: { type: Number, default: null, require: true },

    receiving: {
      type: String,
      default: "shop",
      enum: ["delivery", "shop"],
      require: true,
    },

    payment: {
      type: String,
      default: "",
      enum: ["", "cash", "banking"],
      require: true,
    },

    status: {
      type: String,
      default: "waiting",
      enum: ["waiting", "packed", "waiting delivery", "delivery", "success"],
      require: true,
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

orderSchema.methods.toJSON = function () {
  const order = this._doc;
  delete order.isDeleted;
  return order;
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
