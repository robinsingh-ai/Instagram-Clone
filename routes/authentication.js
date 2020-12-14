const express = require("express");


const router = express.Router();

const crypto = require("crypto");
const mangoose = require("mongoose");
const User = mangoose.model("User");
const bcrypt = require("bcryptjs");
const jsonwebt = require("jsonwebtoken");
const { JWTRANDOMKEY } = require("../config/keys");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const { SENDGRID_API, EMAIL_I } = require("../config/keys");
const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);





//For Auth
const requireLogin = require("../middlewares/requirelogin");



//Signup Route
router.post("/signup", (req, res) => {
 
  const { name, email, password, profile } = req.body;
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ error: "please add all the reqd fields correctlly" });
    
  }
  
  User.findOne({ email: email }) 
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "Email Already Exists" });
      } 
      bcrypt.hash(password, 15).then((hashedpassword) => {
        const user = new User({
          email: email,
          password: hashedpassword,
          name: name,
          profile: profile,
        });
        
        user
          .save()
          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: "rsinghpooj@gmail.com",
              subject: "signup sucess",
              html: "<h2>Welcome To Instagarm Clone</h2>",
            });
            console.log("mail send");
            res.json({ message: "Saved Successfully" });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});























//Signin Route
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "please provide correct credentails" });
    
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res
        .status(422)
        .json({ error: "Invalid USER (email or password) " });
    }
    
    bcrypt
      .compare(password, savedUser.password)
      .then((isEqual) => {
        if (isEqual) {
          

          const token = jsonwebt.sign({ _id: savedUser._id }, JWTRANDOMKEY);
          
          const { _id, name, email, following, followers, profile } = savedUser;

          res.json({
            token: token,
            user: { _id, name, email, following, followers, profile },
          });
        } else {
          return res.status(422).json({ error: "INVALID EMAIL AND PASSWORD" });
          
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});



















//Password Reset Route
router.post("/resetpassword", (req, res) => {
  crypto.randomBytes(50, (error, Buffer) => {
    if (error) {
      console.log(error);
    }
    const crypto_token = Buffer.toString("hex");

    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: "No user " });
      }
      user.reset_token = crypto_token;
      user.expire_token = Date.now() + 7200000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "rsinghpooj@gmail.com",
          subject: "Password Reset",
          html: `
          <p>You requested for password reset</p>
          <p>remember this link will be valid only for 2 hours </p>
          <h4>click here <a href="${EMAIL_I}/reset/${crypto_token}" >Reset</a></h4>
          `,
        });
        res.json({ message: "check your email" });
      });
    });
  });
});






















//NewPassword Route
router.post("/newpassword", (req, res) => {
  const newpassword = req.body.password;
  const sendtoken = req.body.token;

  User.findOne({ reset_token: sendtoken, expire_token: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Session Expired" });
      }
      bcrypt.hash(newpassword, 15).then((hashedpassword) => {
        user.password = hashedpassword;
        user.reset_token = undefined;
        user.expire_token = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "Password Updated" });
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;

//Always check on the mongoDB if the user is save or not
