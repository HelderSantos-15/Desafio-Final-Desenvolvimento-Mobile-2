const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.post('/', usuariosController.criarUsuario);
router.get('/', usuariosController.listarUsuarios);

module.exports = router;
