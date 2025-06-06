const prisma = require('../db');

const findBooks = async () => {
  const books = await prisma.books.findMany({
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
  const book = await prisma.books.findUnique({
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

const findProductByBookProductId = async (bookProductId) => {
  const bookProduct = await prisma.books_Product.findUnique({
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
      id: bookProductId
    }
  });

  return bookProduct;
}

const findProductByBookId = async (bookId) => {
  const bookProduct = await prisma.books_Product.findMany({
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

const updateBookProductStock = async (bookProductId, stock) => {
  const bookProduct = await prisma.books_Product.update({
    where: {
      id: bookProductId
    },
    data: {
      stock: {
        decrement: stock
      }
    }
  });

  return bookProduct;
}

module.exports = {
  findBooks,
  findBookById,
  findProductByBookProductId,
  findProductByBookId,
  updateBookProductStock
}
