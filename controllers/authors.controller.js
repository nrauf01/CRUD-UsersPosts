const Author = require("../models/author.model");

const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";

const createAuthor = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!(name && email && password)) {
    return res
      .status(400)
      .json({ error: "Error", Message: "Fill All input fields" });
  } else {
    try {
      const newUser = new Author({ ...req.body });
      await newUser.save();

      return res.status(201).json(newUser);
    } catch (error) {
      // Object.entries(error.keyValue).map(([key, value]) => {
      //   console.log(`${key} => ${value}`);
      // });
      if (error.message.includes("duplicate")) {
        return res.status(409).json({
          error: `duplicate key ${Object.keys(error.keyValue)[0]}`,
          message: `${Object.values(error.keyValue)[0]} is already in use`,
        });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getAll = async (req, res) => {
  try {
    const users = await Author.find({}, "name email");
    res.send(users);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
};

const updateOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Author.findOneAndUpdate(
      { _id: id },
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
    return res.status(500).json({ error: "server error" });
  }
};

const deleteAuthor = async (req, res, next) => {
  console.log(req.authorId);
  await Author.findByIdAndDelete(req.authorId);

  try {
    return res.status(200).json({ Message: "user deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
const getSingle = async (req, res, next) => {
  console.log(req.authorId);
  const user = await Author.findById(req.authorId);
  try {
    return res
      .status(200)
      .json({ email: user.email, id: user._id, name: user.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

const singIn = async (req, res, callback) => {
  const { email, password } = req.body;
  try {
    const check = await Author.findOne({ email });

    if (check == null) {
      return res.status(400).json({ error: "user does not exist" });
    }
    if (check.password === password) {
      const token = jwt.sign({ id: check._id }, SECRET_KEY, {
        expiresIn: "2h",
      });

      return res.status(200).json({ token });
    } else {
      return res
        .status(400)
        .json({ error: "error", message: "password is not correct" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "server error" });
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
