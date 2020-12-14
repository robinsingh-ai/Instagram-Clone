const jwt = require("jsonwebtoken");
const { JWTRANDOMKEY } = require("../config/keys");
const mangoose = require("mongoose");
const User = mangoose.model("User");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //Authorization === Bearer JWT token
  if (!authorization) {
    return res.status(401).json({ error: "You Must Be Loggedin" });
  } else {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWTRANDOMKEY, (error, payload) => {
      if (error) {
        return res.status(401).json({ error: "You Must be Logged in" });
      }
      const { _id } = payload;
      User.findById(_id).then((userData) => {
        req.user = userData;
        next();
      });
    });
  }
};
