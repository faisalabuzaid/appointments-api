const express = require("express");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const saltRounds = 10;

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    res.status(200).send(
      await User.find({ role: "seller" }).sort({
        username: 1,
      })
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (!error) {
    try {
      if (await User.findOne({ username: req.body.username }))
        return res
          .status(400)
          .send("Username already in use, pick anohther one please!!");
      else {
        const newUser = {
          role: req.body.role,
          username: req.body.username,
          password: await bcrypt.hash(req.body.password, saltRounds),
          services: req.body.services,
          appointments: req.body.appointments,
        };

        const user = await User.create(newUser);
        const token = user.generateAuthTokens();
        res
          .header("x-auth-token", token)
          .status(200)
          .send(_.pick(user, ["_id", "username", "role"]));
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    res.status(400).send(error.message);
  }
});

module.exports = router;
