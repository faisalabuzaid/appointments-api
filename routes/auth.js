const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const saltRounds = 10;

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (!error) {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send("Invalid user or password!!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid user or password!!");
    const token = user.generateAuthTokens();
    res.send({ user: user, accessToken: token });
  } else {
    res.status(400).send(error.message);
  }
});

function validate(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

module.exports = router;
