const express = require("express");
const router = express.Router();

const { verifyLogin } = require("../modules/verifyLogin");
const { addData, getData } = require("../modules/dbConfig");

router.post("/", verifyLogin, async(req, res) => {
    const data = await getData("periods");
    res.json({ data })
});

router.post("/add", verifyLogin, async(req, res) => {
    await addData("periods", req.body);
    res.json({ 'Success': 'Record Added!' })
});

module.exports = router;