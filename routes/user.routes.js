// const express = require("express");
// const router = express.router;
const router = require("express").Router();

const UserModel = require("../models/User.model.js");
const DeckModel = require("../models/Deck.model.js");
const CardModel = require("../models/Card.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// check if the User is authenticated
router.get("/:userId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "User found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// updating a User

router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!updatedUser) {
      res.status(500).json({ errorMessage: "User not found" });
    } else {
      res.status(200).json({ message: "User updated successfully", updatedUser });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "User not found", error });
  }
});

// get the User and populate his Profile with his Decks

router.get("/populate/:userId", (req, res) => {
  console.log("This is the reqparams from getting a User and populating his Profile with Decks", req.params.userId);
  UserModel.findById(req.params.userId)
    .populate("decks")
    .select("-password")
    .then((oneUserModel) => {
      console.log(req.params.userId);
      res.status(200).json(oneUserModel);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while finding the User", error });
      console.log(error);
    });
});

router.delete("/:userId", (req, res) => {
  UserModel.findByIdAndDelete(req.params.userId)
    .then((deletedUser) => {
      console.log(req.params.userId);
      if (!deletedUser) {
        res.status(500).json({ message: "Something bad happened while deleting user" });
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Something bad happened while deleting user", error });
    });
});

/////// DECK ROUTES FROM HERE //////////

//search for a Card

router.get("/card/search", async (req, res) => {
  const searchTerm = req.query.q; // Extract the search term from the query parameter

  try {
    // Check if the searchTerm is a number
    // const isNumber = !isNaN(parseFloat(searchTerm));

    let query;
    // if (isNumber) {
    //   query = { cmc: searchTerm };
    // } else {
    query = { name: { $regex: searchTerm, $options: "i" } };
    // }

    const results = await CardModel.find(query, { name: 1, mana_cost: 1, cmc: 1, type_line: 1, color_identity: 1, image_uris: 1 });

    if (results.length === 0) {
      return res.status(404).json({ message: "No results found" });
    }

    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// show details about a specific Card

router.get("/card/:cardId", (req, res) => {
  console.log("This is the reqparams from the specific Cardsearch", req.params.cardId);
  CardModel.findById(req.params.cardId)
    .then((oneCardModel) => {
      console.log(oneCardModel, req.params.cardId);
      res.status(200).json(oneCardModel);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while finding the Card", error });
      console.log(error);
    });
});

// create a new Deck

router.post("/deck", (req, res) => {
  DeckModel.create(req.body)
    .then((newDeck) => {
      res.status(201).json(newDeck);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get the deck of a User and populate it with the Cards

router.get("/deck/:deckId", (req, res) => {
  console.log("This is the reqparams from getting a Deck", req.params.deckId);
  DeckModel.findById(req.params.deckId)
    .populate("cards")
    .then((oneDeckModel) => {
      res.status(200).json(oneDeckModel);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while finding the Deck", error });
      console.log(error);
    });
});

// update a Deck

router.put("/deck/:deckId", async (req, res) => {
  const { deckId } = req.params;
  try {
    const updatedDeck = await DeckModel.findByIdAndUpdate(deckId, req.body, {
      new: true,
    });
    if (!updatedDeck) {
      res.status(500).json({ errorMessage: "Deck not found" });
    } else {
      res.status(200).json({ message: "Deck updated successfully", updatedDeck });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "Deck not found", error });
  }
});

// deleting a Deck

router.delete("/deck/:deckId", async (req, res) => {
  try {
    const deletedDeck = await DeckModel.findByIdAndDelete(req.params.deckId);

    if (!deletedDeck) {
      return res.status(500).json({ message: "Something bad happened while deleting the Deck" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(deletedDeck.user, { $pull: { decks: deletedDeck._id } }, { new: true });
    console.log("This is the updatedUser", updatedUser);
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user model after deleting deck", deletedDeck });
    }
    // return res.status(204).send(updatedUser);
    return res.status(204).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Something bad happened while deleting the Deck", error });
  }
});

// create a new Card

router.post("/card", (req, res) => {
  CardModel.create(req.body)
    .then((newCard) => {
      res.status(201).json(newCard);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
