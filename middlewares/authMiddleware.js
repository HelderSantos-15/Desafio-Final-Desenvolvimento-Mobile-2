// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const tokenService = require('../services/tokenService');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  if (tokenService.tokenEstaInvalido(token)) {
    return res.status(403).json({ error: 'Token inválido (logout)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;     // adiciona dados do usuário no req
    req.token = token;         // necessário para o logout
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};
