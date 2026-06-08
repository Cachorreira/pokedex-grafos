const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/graphController');

router.get('/', ctrl.resumo);

module.exports = router;
