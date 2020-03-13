const Product = require('../models').products;

/**
 * Get products list
 */
exports.list = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    return res.json({
      code: 200,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};
