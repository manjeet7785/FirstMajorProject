const mongoose = require("mongoose")
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const url = "mongodb+srv://manjeetmaurya7785_db_user:f9Q4YLCbY2Y26jSX@alldata.a9zrfm3.mongodb.net/PropertyList";


main()
  .then(() => {
    console.log("Connected DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {

  await mongoose.connect(url);

}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "6908d9c4f3ec23b2e284d4e8" }));
  await Listing.insertMany(initData.data);
  console.log("Data was Initialized.")

};
initDB();




