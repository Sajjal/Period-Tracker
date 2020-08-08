const db = require("monk")("localhost/periodTracker");

//Add data in Collection
async function addData(collectionName, data) {
  const collection = db.get(collectionName);
  await collection.insert(data);
}

//Get all data in Collection
async function getData(collectionName) {
  const collection = db.get(collectionName);
  let data = await collection.find({}, { sort: { pDate: -1 } });
  return data;
}

module.exports = { addData, getData };
