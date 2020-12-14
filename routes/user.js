const express = require("express");
const router = express.Router();
const mangoose = require("mongoose");
const Post = mangoose.model("Post");
const User = mangoose.model("User");
const requireLogin = require("../middlewares/requirelogin");




//User Route
router.get("/user/:id", requireLogin, (req, res) => {
  
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
          if (error) {
            return res.status(422).json({ error: error });
          }
          res.json({ user, posts });
        });
    })
    .catch((error) => {
      return res.status(404).json({ error: "User Not Found" });
    });
});
























//Follow functionality
router.put("/follow", requireLogin, (req, res) => {
  
  User.findByIdAndUpdate(
    req.body.followId,
    {
      
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});














//Unfollow functionality
router.put("/unfollow", requireLogin, (req, res) => {
 
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});




















//Pic Update functionality
router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { profile: req.body.profile } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot be updated" });
      } else {
        res.json(result);
      }
    }
  );
});
module.exports = router;
