const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

router.post('/', PedidoController.create);
router.get('/', PedidoController.getAll);
router.get('/:id', PedidoController.getById);
router.patch('/:id/status', PedidoController.updateStatus);
router.delete('/:id', PedidoController.delete);

module.exports = router;
