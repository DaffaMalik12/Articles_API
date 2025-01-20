const db = require("../config/db");

exports.getAllArticles = (req, res) => {
  db.query("SELECT * FROM articles", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getArticleById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM articles WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Article not found" });
    res.json(results[0]);
  });
};

exports.createArticle = (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Path gambar

  db.query(
    "INSERT INTO articles (title, content, image) VALUES (?, ?, ?)",
    [title, content, image],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Article created successfully" });
    }
  );
};

exports.updateArticle = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Path gambar

  db.query(
    "UPDATE articles SET title = ?, content = ?, image = ? WHERE id = ?",
    [title, content, image, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Article updated successfully" });
    }
  );
};

exports.deleteArticle = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM articles WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Article deleted successfully" });
  });
};
