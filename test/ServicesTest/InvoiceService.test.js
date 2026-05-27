const service = require('../../src/Services/InvoiceService');
const { Invoice, InvoiceDetail, Product, sequelize } = require('../../src/Models');

// Mocks de los modelos y la base de datos
jest.mock('../../src/Models');

describe('Invoice Service - Cálculos Matemáticos', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock de la transacción de Sequelize
        sequelize.transaction.mockResolvedValue({
            commit: jest.fn(),
            rollback: jest.fn()
        });
    });

    test('debe calcular subtotal, IVA y total correctamente para un producto', async () => {
        // Datos de prueba: Producto de $100 con 19% de IVA
        const mockProduct = { id: 1, price: 100, taxPercentage: 19, isActive: true };
        Product.findByPk.mockResolvedValue(mockProduct);
        
        Invoice.create.mockResolvedValue({ id: 10, total: 119 });
        InvoiceDetail.bulkCreate.mockResolvedValue([]);

        const data = {
            customerId: 1,
            items: [{ productId: 1, quantity: 2 }] // 2 unidades
        };

        const result = await service.createInvoice(data);

        // Verificaciones de Software Testing:
        // Subtotal esperado: 100 * 2 = 200
        // IVA esperado: 200 * 0.19 = 38
        // Total esperado: 238
        expect(Invoice.create).toHaveBeenCalledWith(expect.objectContaining({
            subtotal: 200,
            totalTax: 38,
            total: 238
        }), expect.any(Object));
    });

    test('debe fallar si el producto no existe o está inactivo', async () => {
        Product.findByPk.mockResolvedValue(null); // Producto no encontrado

        const data = {
            customerId: 1,
            items: [{ productId: 99, quantity: 1 }]
        };

        await expect(service.createInvoice(data)).rejects.toThrow('Producto 99 no encontrado');
    });
});