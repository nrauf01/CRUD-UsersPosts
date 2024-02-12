const Post = require("../models/post.model");
const author = require("../models/author.model");

const createPost = async (req, res, next) => {
  try {
    const postData = new Post({ ...req.body, author: req.authorId });
    await postData.save();
    console.log(postData);

    return res.status(200).json(postData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
};

const getPosts = async (req, res, next) => {
  try {
    console.log(req.authorId);
    const posts = await Post.find({ author: req.authorId });

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ error: "error", message: "No posts are available" });
    } else {
      return res.send(posts);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "error", Message: "Internal Server Error" });
  }
};
const like = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const postExist = await Post.findById(postId);
    const userExist = await author.findById(userId);

    if (!postExist) {
      return res.status(400).json({ Error: "post does not exist" });
    }
    if (!userExist) {
      return res.status(400).json({ Error: "user not exist" });
    }

    if (postExist.likedBy.includes(userId)) {
      return res.status(400).json({ Message: "Post already liked." });
    }

    if (postExist.dislikedBy.includes(userId)) {
      postExist.dislikedBy.pull(userId);
      postExist.dislikes -= 1;
    }

    postExist.likedBy.push(userId);
    postExist.likes += 1;

    const savedLikes = await postExist.save();
    return res.status(200).json({ savedLikes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

module.exports = { createPost, like, getAll, getPosts };
