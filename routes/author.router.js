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
const authorizer = require("../helpers/authorizer/authorizer");

router.post("/register", createAuthor);
router.get("/", getAll);
router.post("/signin", singIn);

router.use(authorizer);

router.delete("/", deleteAuthor);

router.put("/:id", updateOne);

router.get("/user", getSingle);

module.exports = router;
