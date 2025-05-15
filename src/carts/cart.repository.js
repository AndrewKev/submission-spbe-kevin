const prisma = require('../db');

const findUncheckedOutCartByCustomerId = async (custId, arrCheckedout) => {
  const cart = await prisma.cart.findFirst({
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
      customer_id: custId,
      id: {
        notIn: arrCheckedout
      }
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

const insertToCartId = async (cartId, data) => {
  const item = await prisma.cart_Item.create({
    data: {
      cart_id: cartId,
      books_product_id: data.books_product_id,
      quantity: data.quantity,
    },
  });

  return item;
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

const updateCartItemQuantity = async (bookProductId, cartItemId, quantity) => {
  const cartItem = await prisma.cart_Item.update({
    where: {
      id: cartItemId,
      books_product_id: bookProductId
    },
    data: {
      quantity: quantity
    }
  });

  return cartItem;
}

module.exports = {
  findUncheckedOutCartByCustomerId,
  insertToCartId,
  createCartWithItems,
  updateCartItemQuantity
}