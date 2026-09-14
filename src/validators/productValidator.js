const { body } = require('express-validator');

const productRules = () => {
  return [
    body('name', 'Product name is required').notEmpty(),
    body('price', 'Price must be a positive number').isFloat({ min: 0 }),
    body('stock_quantity', 'Stock quantity must be a non-negative integer').isInt({ min: 0 }),
    body('category', 'Category is required').notEmpty(),
  ];
};

module.exports = {
  productRules,
};
