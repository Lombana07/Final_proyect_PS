const express = require('express');
const router = express.Router();
const controller = require('../Controllers/InvoiceController');
const { verifyToken, checkRole } = require('../Middlewares/authMiddlewares');
const reportController = require('../Controllers/ReportController'); 

// RUTAS DE REPORTES
router.get('/reports/tax-summary', verifyToken, checkRole('ADMIN', 'VIEWER'), reportController.getTaxReport);
router.post('/reports/send-email', verifyToken, checkRole('ADMIN'), reportController.sendReportByEmail);

// RUTAS EXISTENTES

router.post('/', verifyToken, checkRole('ADMIN', 'BILLER'), controller.create);
router.get('/:id', verifyToken, checkRole('ADMIN', 'BILLER', 'VIEWER'), controller.getById);
router.delete('/:id', verifyToken, checkRole('ADMIN'), controller.annul);

module.exports = router;