const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema(
  {
    productId: {
      type: mongoose.SchemaTypes.ObjectId || null,
      ref: "Product",
      default: null,
      require: true,
    },

    username: { type: String, default: "", require: true },

    email: { type: String, default: "", require: true },

    comment: { type: String, default: "" },

    star: { type: Number, require: true },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

reviewSchema.methods.toJSON = function () {
  const review = this._doc;
  delete review.isDeleted;
  return review;
};

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
