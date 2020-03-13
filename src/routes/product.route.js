const express = require('express');
const validate = require('express-validation');

const controller = require('../controllers/product.controller');
const { list } = require('../validations/product.validation');

const router = express.Router();

/**
 * @api {get} /products List products
 * @apiDescription Get a list of products
 * @apiVersion 1.0.0
 * @apiName ListProducts
 * @apiGroup Product
 * @apiPermission public
 *
 * @apiSuccess {Object[]}              products       List of products.
 */

router.route('/').get(validate(list), controller.list);

module.exports = router;
