const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Invoice = sequelize.define('Invoice', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  customerId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  date: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  status: { 
    type: DataTypes.ENUM('ISSUED', 'CANCELLED'), 
    allowNull: false 
  },
  subtotal: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  },
  tax: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  },
  total: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  }
}, {
  tableName: 'invoices',
  timestamps: false
});

module.exports = Invoice;