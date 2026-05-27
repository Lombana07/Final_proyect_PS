const { Invoice, InvoiceDetail, Product, sequelize } = require('../Models');

exports.createInvoice = async (data) => {
    const { customerId, items } = data; 

    // Lanzamos todas las consultas de productos al mismo tiempo
    const detallesCalculados = await Promise.all(items.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        
        if (!product || !product.isActive) {
            throw new Error(`Producto ID ${item.productId} no disponible o inactivo`);
        }

        const price = parseFloat(product.price);
        const quantity = parseInt(item.quantity);
        const subtotalItem = price * quantity;
        const taxItem = subtotalItem * (parseFloat(product.taxPercentage) / 100);

        return {
            productId: product.id,
            quantity,
            price,
            tax: taxItem, // Nombre del campo en tu modelo InvoiceDetail [3]
            subtotalItem
        };
    }));

    // 2. CÁLCULO DE TOTALES (Suma de los resultados paralelos)
    const subtotalFinal = detallesCalculados.reduce((acc, curr) => acc + curr.subtotalItem, 0);
    const taxFinal = detallesCalculados.reduce((acc, curr) => acc + curr.tax, 0);

    const t = await sequelize.transaction();

    try {
        // 3. CREAR CABECERA (Con totales ya listos)
        const invoice = await Invoice.create({
            customerId,
            status: 'ISSUED', // Según tu ENUM en el modelo [4]
            subtotal: subtotalFinal,
            tax: taxFinal,
            total: subtotalFinal + taxFinal
        }, { transaction: t });

        // 4. INSERCIÓN MASIVA (bulkCreate) EFICIENCIA TOTAL
        const detallesConId = detallesCalculados.map(d => ({
            ...d,
            invoiceId: invoice.id
        }));

        await InvoiceDetail.bulkCreate(detallesConId, { transaction: t });

        await t.commit();
        return invoice;

    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// Mantenemos la anulación corregida para tu ENUM
exports.annulInvoice = async (id) => {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) throw new Error('Factura no encontrada');
    return await invoice.update({ status: 'CANCELLED' }); // Compatible con tu modelo [4]
};