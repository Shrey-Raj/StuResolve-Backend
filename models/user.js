const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: [true, "plz give name "] },
  image : {type : String } , 
  email: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  gradYear: { type: Number, required: true },
  password: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, 
});

const User = new mongoose.model("User", UserSchema);

module.exports = User;

//demo data
// {
//     "name": "Shrey Raj",
//     "branch":"Computer Science",
//     "email": "hello@gmail.com",
//     "image":"https://imgr.com/4221"
//     "gradYear":2025,
//     "password": "laptop0000",
//     "confirmPass" : "laptop0000"
// }
