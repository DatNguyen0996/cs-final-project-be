const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    name: { type: String, default: "Bedminton Store" },

    userId: {
      type: mongoose.SchemaTypes.ObjectId || null,
      ref: "User",
      default: null,
      require: true,
    },

    receiver: { type: String, default: "", require: true },

    phone: { type: String, default: null, require: true },

    address: { type: String, default: "" },

    storeId: {
      type: Schema.ObjectId,
      default: null,
      require: true,
      ref: "Store",
    },

    items: [
      {
        product: { type: Schema.ObjectId, ref: "Product" },
        quantity: { type: Number },
        totalPrice: { type: Number },
      },
    ],

    totalPrice: { type: Number, default: null, require: true },

    receiving: {
      type: String,
      default: "delivery",
      enum: ["delivery", "shop"],
      require: true,
    },

    payment: {
      type: String,
      default: "cash",
      enum: ["cash", "banking"],
      require: true,
    },

    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "packing",
        "waiting",
        "delivery",
        "paymented",
        "success",
        "cancle",
      ],
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
