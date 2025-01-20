const express = require("express");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/", authenticate, getAllArticles);
router.get("/:id", authenticate, getArticleById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  createArticle
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  updateArticle
);
router.delete("/:id", authenticate, authorize("admin"), deleteArticle);

module.exports = router;
