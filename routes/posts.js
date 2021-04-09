const express = require("express");
const User = require("../model/User.js");
const router = express.Router();
const verify = require("./verifyToken.js");

// add our middleware (verify)
router.get("/", verify, (req, res) => {
  // res.json({
  //   posts: {
  //     title: "my first post",
  //     description: "rendom data from post router",
  //   },
  // });
  res.send(req.user);
});

module.exports = router;
