// routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuariosModel = require('../models/usuariosModel');

router.post('/', async (req, res) => {
  const { usuario, senha } = req.body;
  const user = await usuariosModel.buscarPorUsuario(usuario);

  if (!user || !(await bcrypt.compare(senha, user.senha))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, usuario: user.usuario },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION || '1hr' }
  );

  // opcional: await usuariosModel.salvarToken(user.id, token);

  res.json({ token });
});

module.exports = router;
