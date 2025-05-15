const jwt = require('jsonwebtoken');

const generateToken = (custId) => {
  return jwt.sign({ custId }, process.env.SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

const getCustIdFromToken = (request) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  const decoded = verifyToken(token);
  const custId = decoded.custId;

  return custId
}

module.exports = {
  generateToken,
  verifyToken,
  getCustIdFromToken
};