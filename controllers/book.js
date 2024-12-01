const Book = require("../models/Book");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");


exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  console.log("createBook appelé");

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject.__userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        const imagePath = path.join("images", filename);

        // Supprimez le fichier image
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression de l'image :", err);
            res.status(500).json({ error: "Erreur de suppression de l'image" });
          } else {
            // Supprime le document du livre de la base de données
            Book.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: "Livre supprimé !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression du livre :", error);
      res.status(500).json({ error });
    });
};

exports.findOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.addRating = (req, res, next) => {
  const userId = req.auth.userId; 
  const grade = req.body.rating; 

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const existingRating = book.ratings.find(rating => rating.userId === userId);

      if (existingRating) {
        return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
      }

      book.ratings.push({ userId, grade });

      const totalRatings = book.ratings.length;
      const averageRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0) / totalRatings;

      book.averageRating = averageRating;

      book.save()
        .then((updatedBook) => res.status(200).json(updatedBook)) // promesse pour renvoyer le livre
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(404).json({ error: "Livre non trouvé" }));
};

exports.bestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie les livres par averageRating en ordre décroissant
    .limit(3) // Limite la réponse aux 3 premiers
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// test