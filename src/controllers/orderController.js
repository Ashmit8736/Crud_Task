const { Order, OrderItem, Product } = require('../models');
const { sequelize } = require('../config/db');

// @desc    Create an order
// @route   POST /orders
// @access  Private
const createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { items } = req.body;
    let total_amount = 0;
    
    // Create the order first to get an ID
    const order = await Order.create({
      userId: req.user.id,
      total_amount: 0,
    }, { transaction });

    for (const item of items) {
      // Use SELECT ... FOR UPDATE to lock the row and prevent race conditions
      const product = await Product.findByPk(item.productId, { 
        transaction,
        lock: transaction.LOCK.UPDATE 
      });

      if (!product) {
        res.status(404);
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock_quantity < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      total_amount += itemTotal;

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      }, { transaction });

      // Deduct stock
      product.stock_quantity -= item.quantity;
      await product.save({ transaction });
    }

    // Update total amount on order
    order.total_amount = total_amount;
    await order.save({ transaction });

    await transaction.commit();

    // Fetch complete order with items
    const createdOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['name'] }]
      }]
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /orders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['name'] }]
      }],
      order: [['created_date', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get one order
// @route   GET /orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['name'] }]
      }]
    });

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Optionally check if order belongs to user or if user is admin
    if (order.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};
