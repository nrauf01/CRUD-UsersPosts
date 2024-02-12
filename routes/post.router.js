const router = require("express").Router();
const {
  createPost,
  like,
  getPosts,
  getAll,
  postComment,
} = require("../controllers/post.controller");

const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";
router.use((req, res, next) => {
  if (req?.headers?.authorization) {
    const token = req?.headers?.authorization;

    console.log(token);
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.authorId = decoded.id;
      console.log(decoded);
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid Token" });
    }

    next();
  } else
    return res
      .status(401)
      .json({ error: "Missing Token", message: "No Token Found" });
});

router.get("/relevant", getPosts);

router.get("/", getAll);

router.post("/create", createPost);

router.post("/like/:postId/:userId", like);

router.post("/comment/:id", postComment);

module.exports = router;
