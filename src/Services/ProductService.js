const Product = require('../Models/Product');

exports.createProduct = async (data) => {
    const { name, price, taxPercentage } = data;

    // Validación de campos obligatorios según tus requerimientos [3]
    if (!name || price === undefined || taxPercentage === undefined) {
        throw new Error('Faltan campos obligatorios: nombre, precio o porcentaje de IVA');
    }

    return await Product.create({
        name,
        price,
        taxPercentage
    });
};

exports.getProducts = async () => {
    // Solo retornamos los productos activos [1]
    return await Product.findAll({
        where: { isActive: true }
    });
};

exports.getProductById = async (id) => {
    const product = await Product.findByPk(id);
    if (!product || !product.isActive) {
        throw new Error('Producto no encontrado');
    }
    return product;
};

exports.updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Producto no encontrado');
    return await product.update(data);
};

exports.disableProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Producto no encontrado');
    // Desactivación lógica según requerimientos [3]
    return await product.update({ isActive: false });
};