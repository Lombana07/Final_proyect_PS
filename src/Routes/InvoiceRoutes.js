const express = require('express');
const router = express.Router();
const controller = require('../Controllers/InvoiceController');
const { verifyToken, checkRole } = require('../Middlewares/authMiddlewares');

router.post('/', verifyToken, checkRole('ADMIN', 'BILLER'), controller.create);
router.get('/:id', verifyToken, checkRole('ADMIN', 'BILLER', 'VIEWER'), controller.getById);

module.exports = router;