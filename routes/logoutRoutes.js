// routes/logoutRoutes.js
const express = require('express');
const router = express.Router();
const tokenService = require('../services/tokenService');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const token = req.token;
  tokenService.invalidarToken(token);
  res.status(200).json({ message: 'Logout realizado com sucesso' });
});

module.exports = router;
