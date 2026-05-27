const express = require('express');
const router = express.Router();
const controller = require('../Controllers/UserController');
const { verifyToken, checkRole } = require('../Middlewares/authMiddlewares');

// CRUD DE USUARIOS - PROTEGIDO
// Solo un usuario con rol 'ADMIN' puede gestionar a otros usuarios

// Crear usuario [6]
router.post(
    '/', 
    verifyToken, 
    checkRole('ADMIN'), 
    controller.create
);

// Actualizar usuario [6]
router.put(
    '/:id', 
    verifyToken, 
    checkRole('ADMIN'), 
    controller.update
);

// Eliminar usuario [6]
router.delete(
    '/:id', 
    verifyToken, 
    checkRole('ADMIN'), 
    controller.delete
);

module.exports = router;