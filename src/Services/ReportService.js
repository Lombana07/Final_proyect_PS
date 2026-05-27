const { Invoice, InvoiceDetail, Product, Customer } = require('../Models'); // [2]
const { Op } = require('sequelize');

exports.getTaxReportData = async (startDate, endDate) => {
    // Buscamos facturas emitidas en el rango, incluyendo TODO lo relacionado [4, 7]
    const invoices = await Invoice.findAll({
        where: {
            status: 'ISSUED', // Solo facturas válidas [4]
            date: { [Op.between]: [new Date(startDate), new Date(endDate)] }
        },
        include: [
            { model: Customer, attributes: ['name', 'documentNumber', 'isActive'] }, // [8]
            { 
                model: InvoiceDetail, // [3]
                include: [{ model: Product, attributes: ['name', 'taxPercentage', 'isActive'] }] // [6]
            }
        ]
    });
  
    // Procesamiento para la DIAN: Agrupar IVA y Ventas por Producto
    const taxSummary = {};

    invoices.forEach(inv => {
        inv.InvoiceDetails.forEach(detail => {
            const productName = detail.Product.name;
            if (!taxSummary[productName]) {
                taxSummary[productName] = {
                    totalSales: 0,
                    totalTax: 0,
                    taxRate: detail.Product.taxPercentage,
                    currentStatus: detail.Product.isActive ? 'Activo' : 'Inactivo' // Informativo para el reporte
                };
            }
            // Sumamos los valores capturados en la factura (trazabilidad histórica) [3]
            taxSummary[productName].totalSales += parseFloat(detail.price) * detail.quantity;
            taxSummary[productName].totalTax += parseFloat(detail.tax);
        });
    });

    return { invoices, taxSummary };
};