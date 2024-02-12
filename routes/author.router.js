var express = require("express");
const router = express.Router();

const {
  deleteAuthor,
  createAuthor,
  getAll,
  updateOne,
  getSingle,
  singIn,
} = require("../controllers/authors.controller");

router.delete("/", deleteAuthor);

router.put("/:id", updateOne);

router.get("/user", getSingle);

router.post("/register", createAuthor);

router.post("/signin", singIn);

router.get("/", getAll);

module.exports = router;
