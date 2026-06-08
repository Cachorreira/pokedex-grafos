const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/moveController');
const auth = require('../middlewares/auth');
const { validarMove } = require('../middlewares/validacao');

router.get('/',    ctrl.listar);
router.get('/:id', ctrl.buscar);

router.post('/',    auth, validarMove, ctrl.criar);
router.put('/:id',  auth, validarMove, ctrl.atualizar);
router.delete('/:id', auth, ctrl.remover);

module.exports = router;
