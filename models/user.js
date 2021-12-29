const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50,
  },
  role: {
    type: String,
    required: true,
    enum: ["seller", "buyer"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  services: {
    type: Object,
    required: function () {
      return this.role === "seller";
    },
  },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
});

userSchema.methods.generateAuthTokens = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username, role: this.role },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().required(),
    services: Joi.object(),
    appointments: Joi.array(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
