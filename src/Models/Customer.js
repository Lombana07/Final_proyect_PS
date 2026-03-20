const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Customer = sequelize.define('Customer', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  documentType: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
  documentNumber: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'customers',
  timestamps: false
});

module.exports = Customer;