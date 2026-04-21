const { Invoice, InvoiceDetail, Product, sequelize } = require('../Models');

exports.createInvoice = async (data) => {
    const { customerId, items } = data; // items es un array de { productId, quantity }

    // Usamos una transacción para asegurar que si falla el detalle, no se cree la factura
    const t = await sequelize.transaction();

    try {
        let subtotalGeneral = 0;
        let totalTaxGeneral = 0;

        // 1. Procesar cada item para calcular subtotales e impuestos
        const processedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findByPk(item.productId);
            if (!product || !product.isActive) throw new Error(`Producto ${item.productId} no encontrado`);

            const price = parseFloat(product.price);
            const subtotal = price * item.quantity;
            const tax = subtotal * (parseFloat(product.taxPercentage) / 100);

            subtotalGeneral += subtotal;
            totalTaxGeneral += tax;

            return {
                productId: product.id,
                quantity: item.quantity,
                price: price,
                tax: tax
            };
        }));

        // 2. Crear la cabecera de la Factura
        const invoice = await Invoice.create({
            customerId,
            subtotal: subtotalGeneral,
            totalTax: totalTaxGeneral,
            total: subtotalGeneral + totalTaxGeneral,
            status: 'EMITIDA' // Por defecto al crear [4]
        }, { transaction: t });

        // 3. Crear los detalles vinculados a esa factura [1]
        const details = processedItems.map(item => ({
            ...item,
            invoiceId: invoice.id
        }));

        await InvoiceDetail.bulkCreate(details, { transaction: t });

        await t.commit();
        return invoice;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

exports.getInvoiceById = async (id) => {
    return await Invoice.findByPk(id, {
        include: ['InvoiceDetails', 'Customer'] // Incluye los detalles y el cliente [2]
    });
};

exports.annulInvoice = async (id) => {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) throw new Error('Factura no encontrada');
    return await invoice.update({ status: 'ANULADA' }); [4]
};