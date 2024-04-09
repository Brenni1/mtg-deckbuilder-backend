const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//register
router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;
  if (email === "" || password === "" || userName === "") {
    res.status(400).json({ message: "Please provide email, password and name" });
    return;
  }
  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const foundUser = await UserModel.findOne({ email });
    if (foundUser) {
      res.status(403).json({ message: "email already taken " });
    } else {
      //before creating a user, make sure to hash his or her password
      const mySalt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, mySalt);
      const hashedUser = {
        ...req.body,
        password: hashedPassword,
      };

      const myNewUser = await UserModel.create(hashedUser);
      console.log("user created", myNewUser);
      res.status(201).json(myNewUser);
    }
  } catch (err) {
    console.log("error signing up", err);
    res.status(500).json(err);
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      res.status(400).json({ message: "No user with this email found!" });
    } else {
      const doesPasswordMatch = bcryptjs.compareSync(password, foundUser.password);
      if (!doesPasswordMatch) {
        res.status(400).json({ message: "Incorrect password!", password });
      } else {
        //***************JWT token **************/
        const { _id, name, decks } = foundUser;
        const payload = { _id, name, decks };
        // ************** creating token *******
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "72h",
        });
        res.status(200).json({
          message: "Great! You are in",
          authToken,
        });
      }
    }
  } catch (err) {
    console.log("error logging in", err);
    res.status(500).json(err);
  }
});

//verify

router.get("/verify", isAuthenticated, (req, res) => {
  console.log("verify route", req.payload);
  // the token is all good
  res.status(200).json(req.payload);
});

module.exports = router;
