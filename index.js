require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authController = require("./authcontroller");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Setup database
mongoose.set("strictQuery", true);
const connection = mongoose
  .connect(process.env.MONGO_DB_CONNECTION)
  .then(() => console.log("Connection  Successful with database . . ."))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3005;

app.post("/register", authController().postRegister);

app.post("/login", authController().postLogin);

app.use((req, res) => {
  //Display the 404 Page , if Wrong Url Entered
  res.json({ error: " URL NOT FOUND " });
});

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
