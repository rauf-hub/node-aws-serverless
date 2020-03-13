const express = require('express');
const validate = require('express-validation');
const passport = require('passport');
const controller = require('../controllers/campaign.controller');
const { checkCampaign } = require('../validations/campaign.validation');

require('../middleware/passport')(passport);
const router = express.Router();

/**
 * @api {post} /check-campaign-availability:id Check Campaign Availability
 * @apiDescription To check if fest or not
 * @apiVersion 1.0.0
 * @apiName checkCampaignAvailability
 * @apiGroup Campaign
 * @apiPermission public
 *
 * @apiParam  {String}                  profileCode           User profile code
 *
 * @apiSuccess {Boolean}                isCampaignActive           Is Campaign Active
 * @apiSuccess {Boolean}                hasRedeemed                To check gift redeemed or not by user
 * @apiSuccess {String}                 link                       Share link
 */

router
  .route('/check-campaign-availability/:id')
  .post(passport.authenticate('jwt', { session: false }), validate(checkCampaign), controller.checkCampaignAvailability);

module.exports = router;
