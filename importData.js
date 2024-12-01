const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Book = require("./models/Book"); // Assure-toi que le chemin est correct

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/grimoirData", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((error) => {
    console.error("Connexion à MongoDB échouée", error);
  });

// Lire le fichier JSON
const filePath = path.join(__dirname, "data.json"); // Remplace par le nom de ton fichier
const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Importer les données dans la base de données
const importData = async () => {
  try {
    await Book.insertMany(jsonData);
    console.log("Données importées avec succès !");
    mongoose.connection.close(); // Ferme la connexion après l'importation
  } catch (error) {
    console.error("Erreur lors de l'importation des données", error);
    mongoose.connection.close();
  }
};

// Lancer l'importation
importData();
