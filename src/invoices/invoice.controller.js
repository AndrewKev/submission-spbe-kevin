const express = require("express");

const router = express.Router();

const { findInvoiceByCustId } = require("./invoice.repository");
const { getCustIdFromToken } = require("../utils/jwt");

router.get("/", async (req, res) => {
  const custId = getCustIdFromToken(req);

  const invoices = await findInvoiceByCustId(custId);
  return res.send(invoices);
})

module.exports = router;