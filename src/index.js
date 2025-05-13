const express = require('express');

const app = express();
const port = 8000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const bookController = require('./books/book.controller');
app.use("/books", bookController);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`)
})