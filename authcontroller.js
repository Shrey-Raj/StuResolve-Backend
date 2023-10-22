const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;

function authController() {
  return {
    async postRegister(req, res) {
      const { name, email, branch, password, gradYear, confirmPass } = req.body;
      try {
        const emailExists = await User.countDocuments({ email });

        if (emailExists > 0) {
          return res.status(409).json({
            message: "This Email already exists !",
            name,
            email,
          });
        }

        if (password != confirmPass) {
          return res.status(409).json({
            message: "Passwords don't match !",
            name,
            email,
          });
        } else {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          const registerUser = new User({
            name,
            email,
            branch,
            gradYear,
            password: `${hashedPassword}`,
          });

          const registered = await registerUser.save();

          return res.status(200).json({
            messsage: "Successfully registered",
            name,
            email,
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(404).json({
          message: "Some error Occured in registering the user",
          name,
          email,
        });
      }
    },
    async postLogin(req, res) {
      const useremail = req.body.email;
      const pass = req.body.password;

      try {
        const user = await User.findOne({ email: useremail }).select(
          "password name"
        );

        if (!user) {
          console.log("User not found");
          return res.status(404).json({
            message: "User Not Found ",
            email: useremail,
          });
        }

        const valid_pass = user.password;
        const isMatched = await bcrypt.compare(pass, valid_pass);

        if (isMatched === true) {
          return res.status(200).json({
            message: "Successfully Logged IN",
            email: useremail,
          });
        } else {
          return res.status(401).json({
            message: "Invalid Email or Password",
            email: useremail,
          });
        }
      } catch (err) {
        console.log(err, "Error in Logging In");
        return res.status(404).json({
          message: "Some error Occured in Logging the user",
          email: useremail,
        });
      }
    },
  };
}

module.exports = authController;
