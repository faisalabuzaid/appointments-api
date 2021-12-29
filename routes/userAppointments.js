const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("../models/user");
require("../models/appointment");

router.get("/", async (req, res) => {
  try {
    res
      .status(200)
      .send(
        await User.findOne({ _id: req.params.id }).populate("appointments")
      );
  } catch (err) {
    res.status(500).send(err.stack);
  }
});

router.post("/", async (req, res) => {
  try {
    if (await User.findOne({ username: req.body.username })) {
      res
        .status(200)
        .send({ notInUse: false, message: "Username already in use" });
    } else {
      const newUser = {
        role: req.body.role,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, saltRounds),
        services: req.body.services,
        appointments: req.body.appointments,
      };

      const user = await User.create(newUser);

      res.status(200).send({ notInUse: true, user: user });
    }
  } catch (err) {
    res.status(400).send(err.stack);
  }
});

module.exports = router;
