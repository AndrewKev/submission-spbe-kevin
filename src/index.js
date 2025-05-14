const express = require('express');

const app = express();
const port = 8000

const {auth} = require('./middleware/auth');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const authController = require('./auth/auth.controller');
app.use("/auth", authController);

const bookController = require('./books/book.controller');
app.use("/books", auth, bookController);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`)
})