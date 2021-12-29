const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Appointment } = require("../models/appointment");
const { User } = require("../models/user");

router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "buyer") {
      res.status(200).send(await Appointment.find({ buyer: req.user._id }));
    }
    res.status(200).send(await Appointment.find({ seller: req.user._id }));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    // await User.findOneAndUpdate({ name: req.body.username}, {
    //   booked: req.body.dates,
    //   bookable: false
    // })
    const newAppointment = await Appointment.create(req.body);
    await User.findOneAndUpdate(
      { _id: newAppointment.seller },
      { $push: { appointments: newAppointment } }
    );
    await User.findOneAndUpdate(
      { _id: newAppointment.buyer },
      { $push: { appointments: newAppointment } }
    );
    res.status(200).send(newAppointment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    if (!req.user.role === "seller")
      return res.status(403).send("You are not authrized to this action");
    await Appointment.findOneAndUpdate(req.params.id, {
      status: req.body.status,
    });
    res.status(200).send("Appointment Status Updated Seuccesfully");
  } catch (err) {
    console.error(err.stack);
  }
});

module.exports = router;
