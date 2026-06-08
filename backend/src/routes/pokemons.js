const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pokemonController');
const auth = require('../middlewares/auth');
const { validarPokemon } = require('../middlewares/validacao');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscar);
router.post('/', auth, validarPokemon, ctrl.criar);

module.exports = router;
