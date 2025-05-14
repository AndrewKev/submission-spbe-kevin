const express = require("express");

const router = express.Router();

const { verifyToken } = require('../utils/jwt');

const {
  findCartByCustomerId,
  createCartWithItems
} = require("./cart.repository");

const {
  findProductByBookId
} = require("../books/book.repository");

router.get("/", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  const decoded = verifyToken(token);
  const custId = decoded.custId;
  const carts = await findCartByCustomerId(custId);

  return res.send(carts)
});

router.post("/items", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  const decoded = verifyToken(token);
  const custId = decoded.custId;

  const bookProduct = await findProductByBookId(req.body?.books_product_id);
  
  const dataToBeInserted = {
    books_product_id: bookProduct[0].id,
    quantity: req.body?.quantity,
  };
  
  const newCart = await createCartWithItems(custId, dataToBeInserted);

  return res.send(newCart.cartItem);
});

module.exports = router;