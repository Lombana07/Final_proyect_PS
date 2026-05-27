const controller = require('../../src/Controllers/ProductController');
const service = require('../../src/Services/ProductService');

// Mock del servicio para no tocar la lógica real [1]
jest.mock('../../src/Services/ProductService');

describe('Product Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    test('debe responder 201 al crear un producto con éxito', async () => {
        const mockProduct = { id: 1, name: 'Laptop', price: 1500 };
        req.body = mockProduct;
        service.createProduct.mockResolvedValue(mockProduct);

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    test('debe responder 400 si hay un error en la creación', async () => {
        service.createProduct.mockRejectedValue(new Error('Datos inválidos'));
        
        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Datos inválidos' });
    });

    test('debe responder 404 si el producto a buscar no existe', async () => {
        req.params.id = 999;
        service.getProductById.mockRejectedValue(new Error('Producto no encontrado'));

        await controller.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Producto no encontrado' });
    });

    test('debe responder con mensaje de éxito al desactivar', async () => {
        req.params.id = 1;
        service.disableProduct.mockResolvedValue({ id: 1, isActive: false });

        await controller.disable(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Producto desactivado'
        }));
    });
});