const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  return res.redirect("/dashboard");
});

router.post("/", async (req, res) => {
  if (req.body.username !== process.env.USERNAME || req.body.password !== process.env.PASSWORD)
    return res.status(400).render("login", { message: "Invalid Login !" });

  //If everything is valid Create and assign a token. Token Expires in 10 Minutes
  const accessToken = jwt.sign({ id: "MrSajjal" }, process.env.TOKEN_SECRET, {
    expiresIn: "600s",
  });

  //Save accessToken to Client's Browser Cookie and Redirect to Dashboard
  res.cookie("accessToken", accessToken).redirect("/dashboard");
  // return res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" }).redirect("/dashboard");
});

module.exports = router;
