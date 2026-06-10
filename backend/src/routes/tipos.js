const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tipoController');
const auth = require('../middlewares/auth');
const { validarTipo } = require('../middlewares/validacao');

router.get('/',   ctrl.listar);
router.get('/:id', ctrl.buscar);
router.post('/', auth, validarTipo, ctrl.criar);
router.put('/:id', auth, validarTipo, ctrl.atualizar);
router.delete('/:id', auth, ctrl.remover);

module.exports = router;
