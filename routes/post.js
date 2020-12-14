const express = require("express");
const router = express.Router();
const mangoose = require("mongoose");
const Post = mangoose.model("Post");
const requireLogin = require("../middlewares/requirelogin");








//Funtion for getting all the posts
router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    
    .populate("postedBy", "_id name profile")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((error) => {
      console.log(error);
    });
});










//Function for getting all followed user's posts 
router.get("/allfollowedpost", requireLogin, (req, res) => {

  Post.find({ postedBy: { $in: req.user.following } })
   
    .populate("postedBy", "_id name profile")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((error) => {
      console.log(error);
    });
});











//For Posting images
router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res
      .status(422)
      .json({ error: "Plz Add images and title (add all the fields)" });
  }

  
  const post = new Post({
    title: title,
    body: body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((error) => {
      console.log(error);
    });
});












//User's profile post function
router.get("/myprofile", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost: mypost });
    })
    .catch((error) => {
      console.log(error);
    });
});













//Like Functionality
router.put("/like", requireLogin, (req, res) => {
  
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      
      $push: { likes: req.user._id },
    },
    {
      
      new: true,
    }
  ).exec((error, result) => {
    if (error) {
      return res.status(422).json({ error: error });
    } else {
      res.json(result);
    }
  });
});









//Unlike Functionality
router.put("/unlike", requireLogin, (req, res) => {
  
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
   
      new: true,
    }
  ).exec((error, result) => {

    if (error) {
      return res.status(422).json({ error: error });
    } else {
      res.json(result);
    }
  });
});















// Comment Functonality
router.put("/comment", requireLogin, (req, res) => {
  
  const comment = {
    text: req.body.text,
   
    postedBy: req.user,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
   
      $push: { comments: comment },
    },
    {
      
      new: true,
    }
  )
    
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error: error });
      } else {
        res.json(result);
      }
    });
});



















//Delete functionality
router.delete("/delete/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((error, post) => {
      if (error || !post) {
        return res.status(422).json({ error: err });
      }
      
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});
module.exports = router;
