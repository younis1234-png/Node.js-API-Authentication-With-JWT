const { Router } = require("express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// import router
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connect to db!");
  }
);

//  Middlewares (so we can send post request)
app.use(express.json());

// Route middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("server is running"));
