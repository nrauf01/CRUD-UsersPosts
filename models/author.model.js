const { Schema, model } = require("mongoose");

const AuthorSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
    name: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Author", AuthorSchema);
