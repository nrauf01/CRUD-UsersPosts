const router = require("express").Router();
const {
  createPost,
  like,
  getPosts,
  getAll,
  postComment,
  updatePost,
  deletePost,
  deleteComment,
  getSingle,
} = require("../controllers/post.controller");

const authorizer = require("../helpers/authorizer/authorizer");
router.use(authorizer);

router.put("/:id", updatePost);

router.get("/relevant", getPosts);

router.get("/", getAll);

router.get("/:id", getSingle);

router.post("/create", createPost);

router.post("/like/:postId/:userId", like);

router.post("/comment/:id", postComment);

router.delete("/:id", deletePost);

router.delete("/delComment/:id", deleteComment);

module.exports = router;
