var express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";

const {
  deleteAuthor,
  createAuthor,
  getAll,
  updateOne,
  getSingle,
  singIn,
} = require("../controllers/authors.controller");

router.post("/register", createAuthor);
router.get("/", getAll);

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

router.post("/signin", singIn);

router.delete("/", deleteAuthor);

router.put("/:id", updateOne);

router.get("/user", getSingle);

module.exports = router;
