const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");

const path = require("path");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://arthur:savonsavon@monvieuxgrimoir.5zbgn.mongodb.net/?retryWrites=true&w=majority&appName=monvieuxgrimoir"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => {
    console.error("Connexion à MongoDB échouée !", error);
  });

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

// app.use(bodyParser.json());

module.exports = app;
