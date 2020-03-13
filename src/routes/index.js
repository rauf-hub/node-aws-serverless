const express = require('express');
const userRoutes = require('./user.route');
const nationalityRoutes = require('./nationality.route');
const productRoutes = require('./product.route');
const campaignRoutes = require('./campaigns.route');

const router = express.Router();

/**
 * GET /status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET /docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);

router.use('/nationalities', nationalityRoutes);

router.use('/products', productRoutes);

router.use('/campaigns', campaignRoutes);

module.exports = router;
