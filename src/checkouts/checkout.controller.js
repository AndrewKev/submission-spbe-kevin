const express = require("express");

const router = express.Router();

const { createInvoiceWithItems } = require("../invoices/invoice.repository");
const { findUncheckedOutCartByCustomerId } = require("../carts/cart.repository");
const { findInvoiceByCustId } = require("../invoices/invoice.repository");
const { updateBookProductStock } = require("../books/book.repository");

const { getCustIdFromToken } = require("../utils/jwt");

router.post("/", async (req, res) => {
  const custId = getCustIdFromToken(req);

  const invoices = await findInvoiceByCustId(custId);
  const arrCheckedout = invoices.map((item) => item.cart_id);

  const carts = await findUncheckedOutCartByCustomerId(custId, arrCheckedout)

  if (!carts) {
    return res.status(404).send({ error: { message: "Empty cart, unable to checkout" } });
  }

  let totalAmount = 0;
  carts.items.forEach(item => {
    totalAmount += item.quantity * parseFloat(item.product.price);
  });

  const invoiceData = {
    totalAmount: parseFloat(totalAmount),
    status: 'pending',
    custId: custId,
    cartId: carts.id,
  }

  const invoiceItemData = carts.items.map(item => {
    return {
      books_product_id: item.books_product_id,
      quantity: item.quantity,
      price: parseFloat(item.product.price),
    }
  });
  // return res.send(invoiceItemData);

  const invoice = await createInvoiceWithItems(invoiceData, invoiceItemData);

  const returnResponse = {
    invoice_id: invoice.id,
    status: invoice.status,
    total_amount: invoice.total_amount,
    issued_at: invoice.issued_at,
  }

  return res.send(returnResponse);
});

module.exports = router;