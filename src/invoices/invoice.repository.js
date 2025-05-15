const prisma = require('../db');

const { updateBookProductStock } = require('../books/book.repository');

const findInvoiceByCustId = async (custId) => {
  const invoice = await prisma.invoice.findMany({
    select: {
      id: true,
      cart_id: true,
      total_amount: true,
      status: true,
      issued_at: true,
    },
    where: {
      cart: {
        customer_id: custId
      }
    },
  });

  return invoice;
}

const insertInvoice = async (tx, invoiceData) => {
  const invoice = await tx.invoice.create({
    data: {
      total_amount: invoiceData.totalAmount,
      status: invoiceData.status,
      customer_id: invoiceData.custId,
      cart_id: invoiceData.cartId,
    },
  });

  return invoice;
}

const insertInvoiceItem = async (tx, invoiceItemData) => {
  const invoiceItem = await tx.invoice_Item.create({
    data: {
      books_product_id: invoiceItemData.books_product_id,
      quantity: invoiceItemData.quantity,
      price: invoiceItemData.price,
      invoice_id: invoiceItemData.invoice_id,
    },
  });

  return invoiceItem;
}

const createInvoiceWithItems = async (invoiceData, invoiceItemDatas) => {
  return await prisma.$transaction(async (tx) => {
    const invoice = await insertInvoice(tx, invoiceData);

    for (const item of invoiceItemDatas) {
      await insertInvoiceItem(tx, {
        ...item,
        invoice_id: invoice.id,
      });
      
      // kurangi stok book product
      await updateBookProductStock(item.books_product_id, item.quantity);
    }

    return invoice;
  });
}

module.exports = {
  findInvoiceByCustId,
  createInvoiceWithItems
}

