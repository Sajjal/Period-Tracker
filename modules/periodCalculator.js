function periodCalculator(date, periodCycle, periodDays) {
  date = date.split("-");

  date = new Date(date[0], date[1] - 1, date[2]).toString().split("00:00:00");
  newDateFrom = new Date(Date.parse(date) + 60 * 60 * 1000 * 24 * periodCycle).toString().split("00:00:00");
  newDateTo = new Date(Date.parse(date) + 60 * 60 * 1000 * 24 * (periodCycle + periodDays - 1)).toString().split("00:00:00");

  estimatedDate = {
    from: newDateFrom[0],
    to: newDateTo[0],
  };
  //console.log(estimatedDate);
  return estimatedDate;
}

//periodCalculator("2020-08-06", 28, 4);

module.exports = { periodCalculator };
