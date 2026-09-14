const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Order,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  timestamps: false,
  hooks: {
    beforeCreate: async (item) => {
      const count = await item.constructor.count();
      item.id = `ordit${String(count + 1).padStart(2, '0')}`;
    }
  }
});

module.exports = OrderItem;
