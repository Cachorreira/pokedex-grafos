const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/usuarioController');

router.get('/favoritos', auth, ctrl.favoritos);
router.post('/favoritos/:id', auth, ctrl.favoritar);
router.delete('/favoritos/:id', auth, ctrl.removerFavorito);
router.get('/equipes', auth, ctrl.equipes);
router.post('/equipes', auth, ctrl.criarEquipe);

module.exports = router;
