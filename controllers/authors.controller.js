const { utilizer } = require("../helpers/utils/utils");
const Author = require("../models/author.model");

const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";

const createAuthor = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    return res
      .status(400)
      .json({ error: "Error", Message: "Fill All Input Fields" });
  } else {
    try {
      const newUser = new Author({ ...req.body });
      await newUser.save();
      return res.status(201).json(newUser);
    } catch (error) {
      return utilizer(res, error);
    }
  }
};

const getAll = async (req, res) => {
  try {
    const users = await Author.find({}, "name email");
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error", message: "Internal Server Error" });
  }
};

const updateOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Author.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { returnOriginal: false }
    );
    if (!user) {
      return res
        .status(404)
        .json({ error: "Error", message: "User not found" });
    } else {
      return res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Error", message: "Internal Server Error" });
  }
};

const deleteAuthor = async (req, res, next) => {
  await Author.findByIdAndDelete(req.authorId);
  try {
    return res.status(200).json({ Message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error", message: "Internal Server Error" });
  }
};

const getSingle = async (req, res, next) => {
  const user = await Author.findById(req.authorId);
  try {
    return res
      .status(200)
      .json({ email: user.email, id: user._id, name: user.name });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error", message: "Internal Server Error" });
  }
};

const singIn = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ error: "Error", message: "Fill All Fields" });
  }
  try {
    const check = await Author.findOne({ email });
    if (!check) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User Not Found" });
    }
    if (check.password === password) {
      const token = jwt.sign({ id: check._id }, SECRET_KEY, {
        expiresIn: "2h",
      });

      return res
        .status(200)
        .json({ token, user: { name: check.name, email: check.email } });
    } else {
      return res
        .status(400)
        .json({ error: "error", message: "password is not correct" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Error", message: "Internal Server Error" });
  }
};

module.exports = {
  deleteAuthor,
  createAuthor,
  getAll,
  updateOne,
  getSingle,
  singIn,
};
