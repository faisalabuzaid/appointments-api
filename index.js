const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middlwares
app.use(express.json());
app.use(cors());
require("./startup/prod")(app);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Listening on Port ${port}...`));

mongoose
  .connect(
    "mongodb+srv://admin:admin@appointmentbooking.csbrz.mongodb.net/appointmentBooking?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected to Mongodb"))
  .catch((err) => console.error("Couldn't connect to mongodb", err));

const appointments = require("./routes/appointments");
const users = require("./routes/users");
const auth = require("./routes/auth");

app.use("/api/appointments", appointments);
app.use("/api/users", users);
app.use("/api/auth", auth);
