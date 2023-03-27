const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    name: { type: String, default: "", require: true },

    productType: { type: String, default: "", require: true },

    image: { type: String, default: "" },

    code: { type: String, default: "", require: true },

    brand: { type: String, default: "", require: true },

    price: { type: Number, default: 0, require: true },

    rating: { type: Array, default: [] },

    review: { type: Array, default: [] },

    available: { type: Object, default: {}, require: true },

    special: { type: Boolean, default: false },

    //specifications of item

    levelOfPlay: { type: String, default: "" },

    formality: { type: String, default: "" },

    playStyle: { type: String, default: "" },

    hardness: { type: String, default: "" },

    balancedPoint: { type: String, default: "" },

    weight: { type: String, default: "" },

    level: { type: String, default: "" },
    //

    description: { type: String, default: "" },

    size: { type: Array, default: [] },

    saleOff: { type: Number, default: 0 },

    gender: { type: String, default: "" },

    color: { type: String, default: "" },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

productSchema.methods.toJSON = function () {
  const product = this._doc;
  delete product.isDeleted;
  return product;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
