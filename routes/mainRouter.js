const express = require("express");
const router = express.Router();

const verifyToken = require("../modules/verifyToken");
const { addData, getData } = require("../modules/dbConfig");
const { periodCalculator } = require("../modules/periodCalculator");

router.get("/", verifyToken, async (req, res) => {
  let data = await getData("periods");
  let date = "";
  let today = new Date(Date.now());
  let diffDays = null;
  let estimatedDate = "";
  if (data.length > 0) {
    lastPeriodDate = new Date(data[0].pDate);
    diffDays = parseInt((today - lastPeriodDate) / (1000 * 60 * 60 * 24));
    date = data[0];
    estimatedDate = periodCalculator(date.pDate, date.pCycle, date.pDays);
  }
  today = today.toLocaleString("sv-SE").split(" ")[0];
  res.render("dashboard", { message: estimatedDate, date: today, data, periodCycle: diffDays || "28" });
});

router.post("/", verifyToken, async (req, res) => {
  let status = "Healthy";
  if (parseInt(req.body.periodCycle) < 28 || parseInt(req.body.periodCycle) >= 35) status = "Weak";
  const currentData = {
    pDate: req.body.lastPeriodDate.toString(),
    pCycle: parseInt(req.body.periodCycle),
    pDays: parseInt(req.body.periodDays),
    status,
  };
  const estimatedDate = periodCalculator(currentData.pDate, currentData.pCycle, currentData.pDays);

  await addData("periods", currentData);

  lastPeriodDate = new Date(currentData.pDate);
  today = new Date(Date.now());
  diffDays = parseInt((today - lastPeriodDate) / (1000 * 60 * 60 * 24));
  today = today.toLocaleString("sv-SE").split(" ")[0];

  data = await getData("periods");
  res.render("dashboard", { message: estimatedDate, date: today, data, periodCycle: diffDays });
});

module.exports = router;
