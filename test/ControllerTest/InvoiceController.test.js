const controller = require('../../src/Controllers/InvoiceController');
const service = require('../../src/Services/InvoiceService');

jest.mock('../../src/Services/InvoiceService');

describe('Invoice Controller - Endpoints', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    test('debe responder 201 al crear una factura exitosamente', async () => {
        const mockInvoice = { id: 50, total: 500, status: 'EMITIDA' };
        service.createInvoice.mockResolvedValue(mockInvoice);
        
        req.body = { customerId: 1, items: [] };

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockInvoice);
    });

    test('debe responder 404 si la factura no existe al consultarla', async () => {
        req.params.id = 999;
        service.getInvoiceById.mockResolvedValue(null);

        await controller.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Factura no encontrada' });
    });
});