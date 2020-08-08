const express = require("express");
const router = express.Router();

const verifyToken = require("../modules/verifyToken");
const { addData, getData } = require("../modules/dbConfig");
const { periodCalculator } = require("../modules/periodCalculator");

router.get("/", verifyToken, async (req, res) => {
  let data = await getData("periods");
  let date = "";
  let estimatedDate = "";
  if (data.length > 0) {
    date = data[0];
    estimatedDate = periodCalculator(date.pDate, date.pCycle, date.pDays);
  }
  res.render("dashboard", { message: estimatedDate, date: date.pDate, data, periodCycle: data.pCycle || "28" });
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
  data = await getData("periods");
  res.render("dashboard", { message: estimatedDate, date: currentData.pDate, data, periodCycle: currentData.pCycle });
});

module.exports = router;
