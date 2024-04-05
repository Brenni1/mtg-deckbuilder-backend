const { Schema, model } = require("mongoose");

const DeckSchema = new Schema({
  cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  deckname: String,
  // coverimage: { type: Image },
});

const Deck = model("Deck", DeckSchema);

module.exports = Deck;
