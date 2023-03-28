const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = Schema(
  {
    name: { type: String, default: "", require: true },

    email: { type: String, default: "", require: true },

    phone: { type: Number, default: 0, require: true },

    content: { type: String, default: "", require: true },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

contactSchema.methods.toJSON = function () {
  const contact = this._doc;
  delete contact.isDeleted;
  return contact;
};

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
