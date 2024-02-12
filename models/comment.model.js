const mongoose = require("mongoose");

const commentModel = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("comment", commentModel);
