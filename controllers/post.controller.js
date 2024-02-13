const Post = require("../models/post.model");
const author = require("../models/author.model");
const comment = require("../models/comment.model");
const { post } = require("../routes/author.router");
const { Types } = require("mongoose");

const createPost = async (req, res, next) => {
  try {
    const postData = new Post({ ...req.body, author: req.authorId });
    await postData.save();
    console.log(postData);

    return res.status(201).json(postData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "server error" });
  }
};

const updatePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { returnOriginal: false }
    );

    if (!post) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Post Not Found" });
    } else {
      return res.status(200).json(post);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Post.findOneAndDelete({ _id: id }, { returnOriginal: false });
    await comment.deleteMany({ postId: id });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "server error" });
  }
};

const postComment = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const content = await Post.findById(Id);
    console.log(content);

    if (content === null) {
      return res
        .status(400)
        .json({ error: "error", message: " post not available" });
    } else {
      console.log(Id);
      const comments = await new comment({
        ...req.body,
        postId: Id,
      });

      await comments.save();

      await Post.findByIdAndUpdate(
        Id,
        {
          $addToSet: { comment: comments },
        },
        { returnOriginal: false }
      );
      console.log(post);

      return res.status(201).json(comments);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "server error" });
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment_ = await comment.findByIdAndDelete(id);

    if (!comment_) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "No comment Found" });
    }
    await Post.findByIdAndUpdate(comment_.postId, {
      $pull: { comment: new Types.ObjectId(id) },
    });

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "error", message: "internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const posts = await Post.find(
      {},
      "-likes -dislikes -likedBy -dislikedBy -__v"
    )
      .populate({
        path: "author",
        select: "name email",
      })
      .populate({
        path: "comment",
        select: "comment createdAt",
      });
    if (posts.length === 0) {
      return res
        .status(400)
        .json({ error: "Error", message: "No Posts are available" });
    } else {
      res.send(posts);
    }
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
};

const getSingle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const singlePost = await Post.findById(id).populate("comment", "comment");
    if (singlePost === null) {
      return res.status(400).json({ message: "post not found" });
    } else {
      return res.status(200).send(singlePost);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error", message: "Internal server error" });
  }
};
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find(
      { author: req.authorId },
      "-likes -dislikes -likedBy -dislikedBy -__v"
    )
      .populate({
        path: "author",
        select: "name email",
      })
      .populate({
        path: "comment",
        select: "comment createdAt",
      });

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "No posts are available" });
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

module.exports = {
  createPost,
  like,
  getAll,
  getPosts,
  postComment,
  updatePost,
  deletePost,
  deleteComment,
  getSingle,
};
