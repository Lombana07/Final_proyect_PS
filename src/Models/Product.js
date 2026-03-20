const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Products = sequelize.define('Products', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  price: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  },
  taxPercentage: { 
    type: DataTypes.DECIMAL(5,2), 
    allowNull: false 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = Products;