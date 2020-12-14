
const express = require("express");
const { request, response } = require("express");
const app = express();
const mangoose = require("mongoose"); 
const PORT = process.env.PORT || 5000; 
const { MONGOURI } = require("./config/keys"); 

//PACKAGES TO INSTALL IS NODEMON,EXPRESS,MANGOOSE









//Below line will connect the mongo uri from keys.js and will connect our data base
mangoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});







mangoose.connection.on("connected", () => {
  console.log("connected to database succesfully");
});









mangoose.connection.on("error", (err) => {
  console.log("Error in connecting to the data base check KEYS.js", err);
});







//Regestering MODEL
require("./models/user");
require("./models/post");






app.use(express.json());
app.use(require("./routes/authentication"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running on PORT", PORT);
});
