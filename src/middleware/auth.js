const { verifyToken } = require('../utils/jwt');

const { findCustomerById } = require('../customers/customer.repository');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).send({ error: { message: 'Unauthorized' } });

    const decoded = verifyToken(token);
    const cust = await findCustomerById(decoded.custId);

    if (!cust) return res.status(403).send({ error: { message: 'Token invalid' } });

    req.user = cust;
    next();
  } catch (err) {
    return res.status(403).send({ error: { message: 'Token invalid' } })
  }
};

module.exports = { auth };