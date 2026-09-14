const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

const syncDB = async () => {
  try {
    // Sync all defined models to the DB
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  syncDB
};
