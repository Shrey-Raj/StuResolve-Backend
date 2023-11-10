require("dotenv").config();
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // Import cookie-parser

function authController() {
  return {
    async postRegister(req, res) {
      const { name, email, image, branch, password, gradYear, confirmPass } =
        req.body;
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
            image,
            branch,
            gradYear,
            password: `${hashedPassword}`,
          });

          const registered = await registerUser.save();

          const expiresIn = 3 * 24 * 60 * 60;
          const token = jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn,
          });

          res.cookie("jwt", token, {
            httpOnly: true, // Make the cookie accessible only via HTTP
            maxAge: expiresIn * 1000, // Expiration time in milliseconds
          });

          return res.status(200).json({
            messsage: "Successfully registered",
            user: {
              name,
              email,
              image,
              branch,
              gradYear,
            },
            token: token,
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(404).json({
          message: `Some error Occured in registering the user  - ${err}`,
          name,
          email,
        });
      }
    },
    async postLogin(req, res) {
      const useremail = req.body.email;
      const pass = req.body.password;

      try {
        const user = await User.findOne({ email: useremail });

        if (!user) {
          console.log("User Not Found");
          return res.status(404).json({
            message: "User Not Found ",
            email: useremail,
          });
        }

        const valid_pass = user.password;
        const isMatched = await bcrypt.compare(pass, valid_pass);

        if (isMatched === true) {
          const expiresIn = 3 * 24 * 60 * 60;
          const token = jwt.sign(
            { email: user?.email, id: user?._id },
            process.env.SECRET_KEY,
            {
              expiresIn,
            }
          );

          res.cookie("jwt", token, {
            httpOnly: true, // Make the cookie accessible only via HTTP
            maxAge: expiresIn * 1000, // Expiration time in milliseconds
          });

          return res.status(200).json({
            message: "Successfully Logged In",
            user: {
              name: user.name,
              email: useremail,
              image: user.image,
              branch: user.branch,
              gradYear: user.gradYear,
            },
            token: token,
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
          message: `Some error Occured in Logging the user - ${err}`,
          email: useremail,
        });
      }
    },
  };
}

module.exports = authController;
