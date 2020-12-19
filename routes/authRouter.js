const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // start blocking after 3 requests
  message: {
    status: 429,
    Error: "429: Access Denied",
  },
});

router.get("/", (req, res) => {
  return res.redirect("/dashboard");
});

router.post("/", createAccountLimiter, async (req, res) => {
  //const response = await axios.post(`${process.env.ACCESS_URL}`, { service: "periodtracker", uuid: req.body.accessCode });
  //if (!response.data.status) return res.render("login.ejs", { message: "Invalid Access Code" });

  if (req.body.accessCode !== process.env.ACCESS_CODE) return res.status(400).render("login", { message: "Invalid Access Code !" });

  //If everything is valid Create and assign a token. Token Expires in 10 Minutes
  const accessToken = jwt.sign({ id: "MrSajjal" }, process.env.TOKEN_SECRET, {
    expiresIn: "600s",
  });

  //Save accessToken to Client's Browser Cookie and Redirect to Dashboard
  res.cookie("accessToken", accessToken).redirect("/dashboard");
  // return res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" }).redirect("/dashboard");
});

module.exports = router;
