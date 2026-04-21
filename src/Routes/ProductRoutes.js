const express = require('express');
const router = express.Router();
const controller = require('../Controllers/ProductController');
const { verifyToken, checkRole } = require('../Middlewares/authMiddlewares');

// Solo ADMIN y BILLER pueden crear productos [8, 9]
router.post('/', verifyToken, checkRole('ADMIN', 'BILLER'), controller.create);

// ADMIN, BILLER y VIEWER pueden ver la lista [8, 9]
router.get('/', verifyToken, checkRole('ADMIN', 'BILLER', 'VIEWER'), controller.getAll);
router.get('/:id', verifyToken, checkRole('ADMIN', 'BILLER', 'VIEWER'), controller.getById);

// Solo ADMIN puede editar o desactivar productos [10]
router.put('/:id', verifyToken, checkRole('ADMIN'), controller.update);
router.delete('/:id', verifyToken, checkRole('ADMIN'), controller.disable);

module.exports = router;