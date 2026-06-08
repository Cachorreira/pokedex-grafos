const express = require('express');
const router = express.Router();
const { cadastro, login } = require('../controllers/authController');
const { validarUsuario } = require('../middlewares/validacao');

router.post('/cadastro', validarUsuario, cadastro);
router.post('/login',    validarUsuario, login);

module.exports = router;
