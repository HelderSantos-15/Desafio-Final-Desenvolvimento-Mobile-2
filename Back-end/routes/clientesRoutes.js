const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { cacheMiddleware } = require('../middlewares/cache'); // garante que exista

router.get('/', cacheMiddleware, clientesController.getClientes);
router.get('/:id', clientesController.getClienteById);
router.post('/', clientesController.addCliente);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;
