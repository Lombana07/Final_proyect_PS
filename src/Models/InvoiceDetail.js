const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const InvoiceDetail = sequelize.define('InvoiceDetail', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  invoiceId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  },
  tax: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  }
}, {
  tableName: 'invoice_details',
  timestamps: false
});

module.exports = InvoiceDetail;