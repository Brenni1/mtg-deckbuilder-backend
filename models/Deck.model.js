const { Schema, model } = require("mongoose");

const DeckSchema = new Schema(
  {
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
    decktitle: String,
    decktags: String,
    deckdescription: String,
    deckstats: String,
    deckformat: String,
    deckcolors: String,
    // coverimage: { type: Image },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Deck = model("Deck", DeckSchema);

module.exports = Deck;
