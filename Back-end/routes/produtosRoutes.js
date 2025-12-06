// routes/produtosRoutes.js
const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController'); // Importa o controller

// Rotas de produtos
router.get('/', produtosController.getProdutos);
router.get('/:id', produtosController.getProdutoById);
router.post('/', produtosController.addProduto);
router.put('/:id', produtosController.updateProduto);
router.delete('/:id', produtosController.deleteProduto);

module.exports = router;