const service = require('../Services/ProductService');

exports.create = async (req, res) => {
    try {
        const product = await service.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const products = await service.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const product = await service.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const product = await service.updateProduct(req.params.id, req.body);
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.disable = async (req, res) => {
    try {
        const product = await service.disableProduct(req.params.id);
        res.json({ message: 'Producto desactivado', product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.activate = async (req, res) => {
    try {
        // Llamas a la función de activar producto
        const result = await service.activateProduct(req.params.id); 
        res.json({ message: 'Producto activado correctamente', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};