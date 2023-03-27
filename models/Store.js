const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = Schema(
  {
    name: { type: String, require: true },

    phone: { type: String || null, default: null },

    address: { type: String || null, default: null },

    administrator: { type: String, default: null, ref: "User" },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.methods.toJSON = function () {
  const store = this._doc;
  delete store.isDeleted;
  return store;
};

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
