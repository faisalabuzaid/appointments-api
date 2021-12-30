const mongoose = require("mongoose");
const Joi = require("joi");

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  date: { required: true, type: Date },
  seller: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

function validateAppointment(appointment) {
  const schema = Joi.object({
    date: Joi.date().required(),
    seller: Joi.string().min(5).max(50).required(),
    buyer: Joi.string().min(5).max(50),
    status: Joi.string(),
  });

  return schema.validate(appointment);
}

exports.Appointment = Appointment;
exports.appointmentSchema = appointmentSchema;
exports.validate = validateAppointment;
