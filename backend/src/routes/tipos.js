const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tipoController');
const auth = require('../middlewares/auth');

router.get('/',   ctrl.listar);
router.post('/',  auth, ctrl.criar);

module.exports = router;
