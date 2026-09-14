const { body } = require('express-validator');

const orderRules = () => {
  return [
    body('items', 'Items must be an array and cannot be empty').isArray({ min: 1 }),
    body('items.*.productId', 'Product ID is required and must be valid UUID').isUUID(),
    body('items.*.quantity', 'Quantity must be an integer greater than 0').isInt({ min: 1 }),
  ];
};

module.exports = {
  orderRules,
};
