const sequelize = require('../Config/database');

const User = require('./User');
const Customer = require('./Customer');
const Product = require('./Product');
const Invoice = require('./Invoice');
const InvoiceDetail = require('./InvoiceDetail');

// Relationships

Customer.hasMany(Invoice, { foreignKey: 'customerId' });
Invoice.belongsTo(Customer, { foreignKey: 'customerId' });

Invoice.hasMany(InvoiceDetail, { foreignKey: 'invoiceId' });
InvoiceDetail.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Product.hasMany(InvoiceDetail, { foreignKey: 'productId' });
InvoiceDetail.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Customer,
  Product,
  Invoice,
  InvoiceDetail
};