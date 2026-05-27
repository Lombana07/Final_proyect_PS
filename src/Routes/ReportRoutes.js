const express = require('express');
const router = express.Router();
const controller = require('../Controllers/InvoiceController');
// Importas el nuevo controlador que creamos para la lógica de reportes
const reportController = require('../Controllers/ReportController'); 
const { verifyToken, checkRole } = require('../Middlewares/authMiddlewares');

// --- RUTAS DE REPORTES (DIAN / FINANCIEROS) ---
// Agrega estas líneas arriba de router.get('/:id', ...)
router.get('/reports/tax-summary', verifyToken, checkRole('ADMIN', 'VIEWER'), reportController.getTaxReport);
router.post('/reports/send-email', verifyToken, checkRole('ADMIN'), reportController.sendReportByEmail);

// --- RUTAS DE GESTIÓN DE FACTURAS ---
// Solo ADMIN y BILLER pueden crear facturas [1, 2]
router.post('/', verifyToken, checkRole('ADMIN', 'BILLER'), controller.create);

// Consultar una factura específica por ID [1]
router.get('/:id', verifyToken, checkRole('ADMIN', 'BILLER', 'VIEWER'), controller.getById);

module.exports = router;