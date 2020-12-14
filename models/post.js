const mangoose = require("mongoose");
const { ObjectId } = mangoose.Schema.Types;
const postSchema = new mangoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    body: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      required: true,
    },

    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

mangoose.model("Post", postSchema);
