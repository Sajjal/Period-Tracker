const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(400).render("login", { message: "Enter Access Code !" });

  //Verify token and Allow access if Everything is good
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).render("login", { message: "Enter Access Code !" });
  }
};
