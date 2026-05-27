const service = require('../Services/InvoiceService');

exports.create = async (req, res) => {
    try {
        const invoice = await service.createInvoice(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const invoice = await service.getInvoiceById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Factura no encontrada' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.annul = async (req, res) => {
    try {
        // Llama al servicio que actualiza el estado a 'CANCELLED' [3]
        const result = await service.annulInvoice(req.params.id);
        res.json({ 
            message: 'Factura anulada correctamente', 
            result 
        });
    } catch (error) {
        // Maneja errores como "Factura no encontrada" [3]
        res.status(400).json({ message: error.message });
    }
};