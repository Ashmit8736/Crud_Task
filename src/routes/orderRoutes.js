const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById
} = require('../controllers/orderController');
const { orderRules } = require('../validators/orderValidator');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, orderRules(), validate, createOrder)
  .get(protect, getUserOrders);

router.route('/:id')
  .get(protect, getOrderById);

module.exports = router;
