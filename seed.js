const mongoose = require("mongoose");
const cardArray = require("../../oracle-cards-20240402090156.json");
const CardModel = require("./models/Card.model.js");
const MONGO_URI = "mongodb://127.0.0.1:27017/final-project";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

const seedDB = async () => {
  await CardModel.insertMany(cardArray);
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("connection closed");
});
