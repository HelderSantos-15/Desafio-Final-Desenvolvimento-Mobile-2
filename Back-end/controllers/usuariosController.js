// controllers/usuariosController.js
const bcrypt = require('bcrypt');
const usuariosModel = require('../models/usuariosModel');

async function criarUsuario(req, res) {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const id = await usuariosModel.createUsuario({ usuario, senhaCriptografada });
  res.status(201).json({ message: 'Usuário criado com sucesso', id });
}

async function listarUsuarios(req, res) {
  const usuarios = await usuariosModel.listarUsuarios();
  res.json(usuarios);
}

module.exports = {
  criarUsuario,
  listarUsuarios,
};
