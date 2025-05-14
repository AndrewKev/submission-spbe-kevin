const express = require("express");

const router = express.Router();

const { 
  findBooks,
  findBookById,
  findProductByBookId
 } = require("./book.repository");

router.get("/", async (req, res) => {
  const books = await findBooks();
  return res.send(books)
});

router.get("/:id", async (req, res) => {
  const bookId = req.params.id;
  const book = await findBookById(bookId);

  if (!book) return res.status(404).send({ error: { message: "Book not found" } });
  
  book.products = await findProductByBookId(bookId);

  return res.send(book)
});

module.exports = router;