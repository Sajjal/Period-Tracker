const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const { createAccountLimiter, verifyLogin } = require("../modules/verifyLogin");

router.get("/", (req, res) => {
    return res.sendFile("index.html", { root: public });
});

router.get("/authorize", verifyLogin, (req, res) => {
    return res.sendStatus(200)
});

router.post("/", createAccountLimiter, async(req, res) => {
    //const response = await axios.post(`${process.env.ACCESS_URL}`, { service: "periodtracker", uuid: req.body.accessCode });
    //if (!response.data.status) return res.json({ Error: "Invalid Access Code" });

    if (req.body.accessCode !== process.env.ACCESS_CODE) return res.json({ Error: "Invalid Access Code" });

    //If everything is valid Create and assign a token. Token Expires in 10 Minutes
    const accessToken = jwt.sign({ id: "MrSajjal" }, process.env.TOKEN_SECRET, { expiresIn: "600s" });

    //Save accessToken to Client's Browser Cookie and Redirect to Dashboard
    //return res.cookie("accessToken", accessToken).status(200).json({ Message: "You are Logged In !" });
    return res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" }).status(200).json({ Message: "You are Logged In !" });
});

router.post("/logout", (req, res) => {
    return res.cookie("accessToken", "", { maxAge: 1 }).json({ Error: "You are Logged out !" });
});

module.exports = router;