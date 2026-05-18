const express = require('express');
const router = express.Router();
const CardapioController = require('../controllers/CardapioController');

router.get('/', CardapioController.listar);
router.get('/:id', CardapioController.buscarPorId);
router.post('/', CardapioController.cadastrar);
router.delete('/:id', CardapioController.deletar);

module.exports = router;
