const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { productRules } = require('../validators/productValidator');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, productRules(), validate, addProduct);

router.route('/:id')
  .get(getProductById)
  .patch(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
