const express = require('express');
const router = express.Router();

// Importa as funções do controller
const {
  getClientes,
  addCliente,
  updateCliente,
  deleteCliente
} = require('../controllers/clientesController');

// Importa o middleware de cache
const { cacheMiddleware } = require('../middlewares/cache');

// ✅ Rota GET com cache (mostrará mensagens no terminal)
router.get('/', cacheMiddleware, getClientes);

// As demais rotas sem cache
router.post('/', addCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

module.exports = router;