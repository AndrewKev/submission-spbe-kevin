const prisma = require('../src/db')

async function main() {
  await prisma.books_Product.deleteMany();
  await prisma.books.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.author.deleteMany();

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'Central Warehouse',
      location: 'Jakarta',
      capacity: 5000,
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'East Warehouse',
      location: 'Surabaya',
      capacity: 3000,
    },
  });

  const author1 = await prisma.author.create({
    data: {
      name: 'John Doe',
      bio: 'John Doe is a fiction writer.',
      birthdate: new Date('1980-05-20'),
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'Jane Smith',
      bio: 'Jane Smith writes science books.',
      birthdate: new Date('1975-10-15'),
    },
  });

  const book1 = await prisma.books.create({
    data: {
      title: 'Mystery in the Night',
      isbn: '1234567890',
      publication_year: 2020,
      genre: 'Fiction',
      author_id: author1.id,
    },
  });

  const book2 = await prisma.books.create({
    data: {
      title: 'The Science of Everything',
      isbn: '0987654321',
      publication_year: 2022,
      genre: 'Science',
      author_id: author2.id,
    },
  });

  await prisma.books_Product.create({
    data: {
      book_id: book1.id,
      price: 150000,
      stock: 100,
      format: 'Hardcover',
      warehouse_id: warehouse1.id,
    },
  });

  await prisma.books_Product.create({
    data: {
      book_id: book2.id,
      price: 200000,
      stock: 80,
      format: 'Paperback',
      warehouse_id: warehouse2.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });