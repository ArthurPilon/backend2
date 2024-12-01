const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  author: { type: String, require: true },
  year: { type: Number, require: true },
  genre: { type: String, require: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true, min: 1, max: 5 }, // Notes de 1 à 5
    },
  ],
  averageRating: { type: Number, required: true, min: 1, max: 5 },
});

module.exports = mongoose.model("Book", bookSchema);
