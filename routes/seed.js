const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/final-project";

const CardModel = require("../models/Card.model.js");
const cardArray = require("120cards_copy.json");

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
});

// const insertManyCards = async () => {
//   try {
//     const createdCards = await CardModel.insertMany(arrayOfCards);
//     console.log("We created many Cards", createdCards);
//   } catch (err) {
//     console.log("there was an error", err);
//   }
// };
// insertManyCards();
