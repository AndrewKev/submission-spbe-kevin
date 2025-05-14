const prisma = require('../db');

const findCustomerById = async (custId) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: custId
    }
  });

  return customer;
}

const findCustomerByEmail = async (email) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: email
    }
  });

  return customer;
}

const insertCustomer = async (customerData) => {
  const cust = await prisma.customer.create({
    data: {
      name: customerData.name,
      email: customerData.email,
      password: customerData.password,
      address: customerData.address,
      phone: customerData.phone,
    }
  });

  return cust;
}

module.exports = {
  findCustomerById,
  findCustomerByEmail,
  insertCustomer
}