// models/usuariosModel.js
const db = require('../configs/db');

async function createUsuario({ usuario, senhaCriptografada }) {
  const [result] = await db.execute(
    'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)',
    [usuario, senhaCriptografada]
  );
  return result.insertId;
}

async function listarUsuarios() {
  const [rows] = await db.execute('SELECT id, usuario FROM usuarios');
  return rows;
}

async function buscarPorUsuario(usuario) {
  const [rows] = await db.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
  return rows[0];
}

module.exports = {
  createUsuario,
  listarUsuarios,
  buscarPorUsuario,
};
