const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { upload, convertToWebP } = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book");

router.post("/", auth, upload, convertToWebP, bookCtrl.createBook);
router.get("/bestrating", bookCtrl.bestRating);
router.get("/", bookCtrl.getAllBooks);
router.put("/:id", auth, upload, convertToWebP, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/:id", bookCtrl.findOneBook);
router.post("/:id/rating", auth, bookCtrl.addRating);
router.put("/:id", auth, upload, convertToWebP, bookCtrl.modifyBook);

module.exports = router;