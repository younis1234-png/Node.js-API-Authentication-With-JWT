const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // re.body live in auth-token if you check postman
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access denied");
  }

  try {
    const verrified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verrified;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
