  const express = require('express');
  const router = express.Router();
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');
  const usuariosModel = require('../models/usuariosModel');

router.post('/', async (req, res) => {
try {
const { usuario, senha } = req.body;
if (!usuario || !senha) return res.status(400).json({ error: 'usuario e senha obrigatórios' });


const user = await usuariosModel.buscarPorUsuario(usuario);
if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

const senhaValida = await bcrypt.compare(senha, user.senha);
if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas' });

// obtém expiresIn do .env (pode ser '1h' ou número em segundos)
const rawExp = process.env.TOKEN_EXPIRATION;
const expiresIn = rawExp ? (!isNaN(Number(rawExp)) ? Number(rawExp) : rawExp) : '1h';

const token = jwt.sign(
  { id: user.id, usuario: user.usuario },
  process.env.JWT_SECRET,
  { expiresIn }
);

// resposta: token JWT
res.json({ token });


} catch (err) {
console.error('Erro no login:', err);
res.status(500).json({ error: 'Erro interno' });
}
});

module.exports = router;
