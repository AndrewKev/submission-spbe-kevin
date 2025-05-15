const express = require("express");

const router = express.Router();

const { getCustIdFromToken } = require('../utils/jwt');

const {
  createCartWithItems,
  insertToCartId,
  updateCartItemQuantity,
  findUncheckedOutCartByCustomerId
} = require("./cart.repository");

const {
  findProductByBookProductId
} = require("../books/book.repository");

const { 
  findInvoiceByCustId
 } = require("../invoices/invoice.repository");


router.get("/", async (req, res) => {
  const custId = getCustIdFromToken(req);
  
  const invoices = await findInvoiceByCustId(custId);
  const arrCheckedout = invoices.map((item) => item.cart_id);

  const carts = await findUncheckedOutCartByCustomerId(custId, arrCheckedout)
  
  if (!carts) return res.send([]);

  return res.send(carts)
});

router.post("/items", async (req, res) => {
  const custId = getCustIdFromToken(req);
  const bookProduct = await findProductByBookProductId(req.body?.books_product_id);
  
  // check user sudah punya cart (yg belum dicheckout) atau belum
  // jika sudah, tambah product ke cart
  // jika belum, buat cart baru
  const invoices = await findInvoiceByCustId(custId);
  const arrCheckedout = invoices.map((item) => item.cart_id);
  const userCart = await findUncheckedOutCartByCustomerId(custId, arrCheckedout)
  
  if (userCart) {
    // masukan product ke cart yg sudah ada
    // cek jika barang sama, maka tambahkan quantity
    const productExist = userCart.items.find(item => item.books_product_id === req.body?.books_product_id);

    if (productExist) {
      const currentQuantity = productExist?.quantity;
      const newQuantity = currentQuantity + req.body?.quantity;

      const updatedProduct = await updateCartItemQuantity(req.body?.books_product_id, productExist.id, newQuantity);

      return res.send(updatedProduct);
    } else {
      const addedToCart = await insertToCartId(userCart.id, req.body);

      return res.send(addedToCart);
    }
  }

  const dataToBeInserted = {
    books_product_id: bookProduct.id,
    quantity: req.body?.quantity,
  };

  const newCart = await createCartWithItems(custId, dataToBeInserted);

  return res.send(newCart.cartItem);
});

module.exports = router;