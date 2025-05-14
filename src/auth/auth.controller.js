const express = require("express");
const { z } = require('zod');
const bcrypt = require('bcrypt');

const router = express.Router();

const {
  findCustomerByEmail,
  insertCustomer
} = require('../customers/customer.repository');

const { generateToken } = require('../utils/jwt');

router.post("/register", async(req, res) => {
  const data = req.body

  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    address: z.string(),
    phone: z.string(),
  });

  const result = schema.safeParse(data);

  if (!result.success) {
    return res.status(400).send({
      message: 'Validation error',
      errors: result.error.flatten().fieldErrors,
    });
  }

  const custExist = await findCustomerByEmail(data.email);

  if (custExist) {
    return res.status(400).send({
      message: 'Email already registered',
    });
  }

  const hashedPassword = await bcrypt.hash(data.password, 2);
  data.password = hashedPassword;

  const cust = await insertCustomer(data);
  
  if (!cust) {
    return res.status(500).send({
      message: 'Failed to register',
    });
  }

  const token = generateToken(cust.id);

  return res.send({token: token});
});

router.post("/login", async(req, res) => {
  const data = req.body

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const result = schema.safeParse(data);

  if (!result.success) {
    return res.status(400).send({
      message: 'Validation error',
      errors: result.error.flatten().fieldErrors,
    });
  }

  const cust = await findCustomerByEmail(data.email);

  if (!cust) {
    return res.status(400).send({
      message: 'Invalid email or password',
    });
  }

  const isValidPassword = await bcrypt.compare(data.password, cust.password);

  if (!isValidPassword) {
    return res.status(400).send({
      message: 'Invalid email or password',
    });
  }

  const token = generateToken(cust.id);

  return res.send({token: token});
});

module.exports = router;
