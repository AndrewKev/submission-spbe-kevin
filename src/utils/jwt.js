const jwt = require('jsonwebtoken');

const generateToken = (custId) => {
  return jwt.sign({ custId }, process.env.SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};