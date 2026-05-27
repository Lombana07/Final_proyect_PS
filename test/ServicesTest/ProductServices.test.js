const service = require('../../src/Services/ProductService');
const Product = require('../../src/Models/Product');

// Mock del modelo de producto tal como hiciste con Customer [2]
jest.mock('../../src/Models/Product');

describe('Product Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debe crear un producto correctamente', async () => {
        const mockData = { name: 'Producto A', price: 100, taxPercentage: 19 };
        Product.create.mockResolvedValue({ id: 1, ...mockData, isActive: true });

        const result = await service.createProduct(mockData);
        
        expect(result.name).toBe('Producto A');
        expect(Product.create).toHaveBeenCalledWith(mockData);
    });

    test('debe lanzar un error si faltan campos obligatorios', async () => {
        // Validación de campos según los requerimientos funcionales [5]
        await expect(service.createProduct({ name: 'Incompleto' }))
            .rejects
            .toThrow('Faltan campos obligatorios: nombre, precio o porcentaje de IVA');
    });

    test('debe retornar solo productos activos', async () => {
        const mockProducts = [{ id: 1, name: 'P1', isActive: true }];
        Product.findAll.mockResolvedValue(mockProducts);

        const result = await service.getProducts();
        
        expect(result).toHaveLength(1);
        expect(Product.findAll).toHaveBeenCalledWith({ where: { isActive: true } });
    });

    test('debe lanzar error si el producto no existe o está inactivo', async () => {
        Product.findByPk.mockResolvedValue(null);
        await expect(service.getProductById(99)).rejects.toThrow('Producto no encontrado');
    });
});