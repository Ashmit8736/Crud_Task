const { Product } = require('../models');
const { Op } = require('sequelize');

// @desc    Add a product
// @route   POST /products
// @access  Private (Assuming admin/staff only, but keeping it simple based on requirements)
const addProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, inStock, page = 1, limit = 10, search } = req.query;
    
    let whereClause = {};

    if (category) {
      whereClause.category = category;
    }

    if (inStock === 'true') {
      whereClause.stock_quantity = { [Op.gt]: 0 };
    } else if (inStock === 'false') {
      whereClause.stock_quantity = 0;
    }

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_date', 'DESC']]
    });

    res.json({
      totalItems: count,
      products: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get one product
// @route   GET /products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PATCH /products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    await product.destroy();
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
