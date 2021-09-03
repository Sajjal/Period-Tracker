const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 3, // start blocking after 3 requests
    message: { status: 429, Error: "429: Access Denied" },
});

async function verifyLogin(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ Error: "Enter Access Code" });
    //Verify token and Allow access if Everything is good
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch {
        return res.status(401).json({ Error: "Enter Access Code" });
    }
}

module.exports = { createAccountLimiter, verifyLogin };