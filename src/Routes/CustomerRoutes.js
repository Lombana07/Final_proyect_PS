const express = require('express');
const router = express.Router();

const controller = require('../Controllers/CustomerController');
const { verifyToken, checkRole } = require('../Middlewares/auth.middleware');

// CREATE → ADMIN, BILLER
router.post(
  '/',
  verifyToken,
  checkRole('ADMIN', 'BILLER'),
  controller.create
);

// GET ALL → ADMIN, BILLER, VIEWER
router.get(
  '/',
  verifyToken,
  checkRole('ADMIN', 'BILLER', 'VIEWER'),
  controller.getAll
);

// GET BY ID → ADMIN, BILLER, VIEWER
router.get(
  '/:id',
  verifyToken,
  checkRole('ADMIN', 'BILLER', 'VIEWER'),
  controller.getById
);

// UPDATE → ADMIN ONLY
router.put(
  '/:id',
  verifyToken,
  checkRole('ADMIN'),
  controller.update
);

// DELETE (desactivar) → ADMIN ONLY
router.delete(
  '/:id',
  verifyToken,
  checkRole('ADMIN'),
  controller.disable
);

module.exports = router;