const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId || null,
      ref: "User",
      default: null,
      require: true,
    },

    productId: {
      type: mongoose.SchemaTypes.ObjectId || null,
      ref: "Product",
      default: null,
      require: true,
    },

    storeId: {
      type: mongoose.SchemaTypes.ObjectId || null,
      ref: "Store",
      default: null,
      require: true,
    },

    productCode: { type: String, default: "", require: true },

    size: { type: String, default: "", require: true },

    quantity: { type: Number, default: 0, require: true },

    price: { type: Number, default: 0, require: true },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// cartSchema.methods.toJSON = function () {
//   const cart = this._doc;
//   delete cart.isDeleted;
//   return cart;
// };

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
