const mongoose = require("mongoose");

const PostModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  ],

  dislikedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  ],

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
});

module.exports = new mongoose.model("post", PostModel);
