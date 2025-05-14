const prisma = require('../db');

const findBooks = async () => {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      isbn: true,
      publication_year: true,
      genre: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return books;
}

const findBookById = async (bookId) => {
  const book = await prisma.book.findUnique({
    select: {
      id: true,
      title: true,
      isbn: true,
      publication_year: true,
      genre: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      id: bookId
    }
  });

  return book;
}

const findProductByBookId = async (bookId) => {
  const bookProduct = await prisma.book_Product.findMany({
    select: {
      id: true,
      format: true,
      price: true,
      stock: true,
      warehouse: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      book_id: bookId
    },
  });

  return bookProduct;
}

module.exports = {
  findBooks,
  findBookById,
  findProductByBookId
}
