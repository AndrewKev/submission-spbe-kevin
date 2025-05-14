const prisma = require('../db');

const findCartByCustomerId = async (custId) => {
  const cart = await prisma.cart.findMany({
    select: {
      id: true,
      customer_id: true,
      created_at: true,
      items: {
        select: {
          id: true,
          books_product_id: true,
          quantity: true,
          created_at: true,
          product: {
            select: {
              book: {
                select: {
                  title: true,
                }
              },
              format: true,
              price: true,
            }
          }
        },
      },
    },
    where: {
      customer_id: custId
    },
  });

  return cart;
}

const insertCart = async (tx, custId) => {
  const cart = await tx.cart.create({
    data: {
      customer_id: custId,
    },
  });

  return cart;
}

const insertCartItem = async (tx, cartItemData) => {
  const cartItem = await tx.cart_Item.create({
    data: {
      cart_id: cartItemData.cart_id,
      books_product_id: cartItemData.books_product_id,
      quantity: cartItemData.quantity,
    },
  });

  return cartItem;
}

const createCartWithItems = async (custId, cartItemData) => {
  return await prisma.$transaction(async (tx) => {
    const cart = await insertCart(tx, custId);

    const cartItem = await insertCartItem(tx, {
      ...cartItemData,
      cart_id: cart.id,
    });

    return { cart, cartItem };
  });
};

module.exports = {
  findCartByCustomerId,
  createCartWithItems
}