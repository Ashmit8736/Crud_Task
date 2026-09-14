const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  order_status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Pending',
  }
}, {
  timestamps: true,
  createdAt: 'created_date',
  updatedAt: 'updated_date'
});

module.exports = Order;
