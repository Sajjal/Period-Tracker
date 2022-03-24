const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const helmet = require("helmet");
const dotenv = require("dotenv").config();

// Only for development
// const cors = require('cors')
// app.use(cors())

//Import routes
const authRouter = require("./routes/authRouter");
const mainRouter = require("./routes/mainRouter");

//MiddleWares
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use("/", authRouter);
app.use("/dashboard", mainRouter);

let port = process.env.PORT || 3000;

app.get("*", function(req, res) {
    res.redirect("/");
});

app.listen(port, function() {
    return console.log(`Listening on localhost:${port}`);
});