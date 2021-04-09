const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // lets validate the data beofre we a user
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // checking if the user is already in the database
  const emailExist = await User.findOne({
    email: req.body.email,
  });
  if (emailExist) {
    return res.status(400).send("email already existe");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    // sending only the user id
    res.send({ user: user._id });
  } catch {
    res.status(400).send(err);
  }
});

// login;
router.post("/login", async (req, res) => {
  // lets validate the data beofre we a user
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // checking if the user is already in the database
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(400).send("Email is invalide");
  }
  // check if password is correct(the input password vs the one we have in our database)
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("Password is not valid");
  }

  // create and assign a token (is way to remember is you)
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send(token);
});

module.exports = router;
