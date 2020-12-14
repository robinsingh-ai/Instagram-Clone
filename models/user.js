const mangoose = require("mongoose");
const { ObjectId } = mangoose.Schema.Types;
const userSchema = new mangoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],

  password: {
    type: String,
    required: true,
  },

  profile: {
    type: String,
    default:
      "https://res.cloudinary.com/robinnaglewala/image/upload/v1600081019/default_pic_nit7pr.jpg",
  },
  reset_token:String,
  expire_token:Date,
});

mangoose.model("User", userSchema);
