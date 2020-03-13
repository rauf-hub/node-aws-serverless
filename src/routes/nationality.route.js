const express = require('express');
const validate = require('express-validation');

const controller = require('../controllers/nationality.controller');
const { list } = require('../validations/nationality.validation');

const router = express.Router();

/**
 * @api {get} /nationalities List nationalities
 * @apiDescription Get a list of nationalities
 * @apiVersion 1.0.0
 * @apiName ListNationalities
 * @apiGroup Nationality
 * @apiPermission public
 *
 * @apiSuccess {Object[]}              nationalities       List of nationalities.
 */

router.route('/').get(validate(list), controller.list);

module.exports = router;
