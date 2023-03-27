const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsOfStoreSchema = Schema(
  {
    store: {
      type: mongoose.SchemaTypes.ObjectId || null,
      ref: "Store",
      default: null,
    },

    product: {
      type: mongoose.SchemaTypes.ObjectId || null,
      ref: "Product",
      default: null,
    },
    productCode: { type: String || "", default: "" },
    productWeight: { type: String, default: "" },
    productSize: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productsOfStoreSchema.methods.toJSON = function () {
  const productsOfStore = this._doc;
  delete productsOfStore.isDeleted;
  return productsOfStore;
};

const ProductsOfStore = mongoose.model(
  "productsOfStore",
  productsOfStoreSchema
);

module.exports = ProductsOfStore;
