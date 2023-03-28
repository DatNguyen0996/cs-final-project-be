const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, require: true },

    email: { type: String, require: true, default: "" },

    password: { type: String, require: true, default: "" },

    role: {
      type: String,
      default: "customer",
      enum: ["manager", "employee", "customer"],
      require: true,
    },

    phone: { type: Number, default: null },

    gender: { type: String, default: null },

    dateOfBirth: { type: String, default: null },

    address: { type: String, default: "" },
    // cart: { type: Array, default: [], ref: "Product" },
    cart: [
      {
        product: { type: Schema.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
    orders: [
      {
        order: { type: Schema.ObjectId, ref: "Order" },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
