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

const PORT = process.env.PORT || 5000 ;

mongoose.set("strictQuery", false);
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.post("/register", authController().postRegister);

app.post("/login", authController().postLogin);

app.use((req, res) => {
  //Display the 404 Page , if Wrong Url Entered
  return res.status(404).json({ error: " URL NOT FOUND " });
});

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running at http:localhost:${PORT}`);
  });
});
