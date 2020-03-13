const express = require('express');
const validate = require('express-validation');
const passport = require('passport');

const controller = require('../controllers/user.controller');
const {
  register,
  resend,
  verify,
  redeemGift,
} = require('../validations/user.validation');

require('../middleware/passport')(passport);

const router = express.Router();

/**
 * @api {post} /users/register Register a User
 * @apiDescription Register a new user and send a OTP to the user's mobile
 * @apiVersion 1.0.0
 * @apiName RegisterUser
 * @apiGroup User
 * @apiPermission public
 *
 * @apiHeader {String}                  content-type        application/json
 *
 * @apiParam  {String{1..128}}          name                  User's name
 * @apiParam  {String{6..20}}           mobile                Mobile phone number
 * @apiParam  {Number{1-}}              nationalityId         Nationality id
 * @apiParam  {Number{1-}}              campaignId            Campaign id
 * @apiParam  {String}                 [referrerProfileCode]  Referrer profile code
 *
 * @apiSuccess (Created 201) {Number}   user.id               User's id
 * @apiSuccess (Created 201) {String}   user.name             User's name
 * @apiSuccess (Created 201) {String}   user.mobile           Mobile phone number
 * @apiSuccess (Created 201) {Number}   user.nationalityId   Nationality id
 * @apiSuccess (Created 201) {Number}   user.campaignId      Campaign id
 * @apiSuccess (Created 201) {Number}   user.referrerId      Referrer id
 * @apiSuccess (Created 201) {String}   user.profileCode     User's profile code
 * @apiSuccess (Created 201) {Boolean}  user.mobileVerified  Boolean if mobile is verified or not
 * @apiSuccess (Created 201) {Date}     user.createdAt        Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/register').post(validate(register), controller.register);

/**
 * @api {post} /users/resend-otp Resend OTP
 * @apiDescription Resend OTP
 * @apiVersion 1.0.0
 * @apiName ResendOTP
 * @apiGroup User
 * @apiPermission public
 *
 * @apiHeader {String}                  content-type        application/json
 *
 * @apiParam  {String}                  mobile              Mobile phone number
 *
 * @apiSuccess {String}                 message             Success message
 *
 * @apiError (Bad Request 400)          ValidationError     Some parameters may contain invalid values
 */
router.route('/resend-otp').post(validate(resend), controller.resendOTP);

/**
 * @api {post} /users/verify-otp Verify OTP
 * @apiDescription Verify OTP
 * @apiVersion 1.0.0
 * @apiName VerifyOTP
 * @apiGroup User
 * @apiPermission public
 *
 * @apiHeader {String}                  content-type        application/json
 *
 * @apiParam  {String}                  mobile              Mobile phone number
 * @apiParam  {String}                  otp                 OTP to verify
 *
 * @apiSuccess {String}                 tokenType           Access Token's type
 * @apiSuccess {String}                 accessToken         Authorization Token
 * @apiSuccess {String}                 refreshToken        Token to get a new accessToken after expiration time
 * @apiSuccess {Number}                 expiresIn           Access Token's expiration time in milliseconds
 *
 * @apiError (Bad Request 400)          ValidationError     Some parameters may contain invalid values
 */
router.route('/verify-otp').post(validate(verify), controller.verifyOTP);

/**
 * @api {patch} v1/users/:id Update User
 * @apiDescription Update some fields of a user record
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission user
 *
 * @apiHeader {String}                  content-type      application/json
 * @apiHeader {String}                  Authorization     Access token
 *
 * @apiParam  {String{1..128}}          [name]            User's name
 * @apiParam  {String{6..20}}           [mobile]          Mobile phone number
 * @apiParam  {Number{1-}}              [nationalityId]  Nationality id
 * @apiParam  {Number{1-}}              [campaignId]     Campaign id
 * @apiParam  {Number{1-}}              [referrerId]     Referrer id
 * @apiParam  {String}                  [email]           User's email
 * @apiParam  {String{6..128}}          [productId]      Product id
 *
 * @apiSuccess {Number}                 id                User's id
 * @apiSuccess {String}                 name              User's name
 * @apiSuccess {String}                 mobile            Mobile phone number
 * @apiSuccess {String}                 email             User's email
 * @apiSuccess {Number}                 nationalityId    Nationality id
 * @apiSuccess {Number}                 campaignId       Campaign id
 * @apiSuccess {Number}                 referrerId       Referrer id
 * @apiSuccess {Number}                 productId        Product id
 * @apiSuccess {String}                 profileCode      User's profile code
 * @apiSuccess {Boolean}                mobileVerified   Boolean if mobile is verified or not
 * @apiSuccess {Object}                 product          If product selected then product detail
 * @apiSuccess {Date}                   createdAt        Timestamp
 * @apiSuccess {Date}                   updatedAt        Timestamp
 *
 * @apiError (Bad Request 400)          ValidationError   Some parameters may contain invalid values
 * @apiError (Unauthorized 401)         Unauthorized      Only authenticated users can modify the data
 * @apiError (Forbidden 403)            Forbidden         Only user with same id can modify the data
 * @apiError (Not Found 404)            NotFound          User does not exist
 */
router
  .route('/:id')
  .patch(
    passport.authenticate('jwt', { session: false }),
    controller.checkEmailExists,
    controller.update,
  );
/**
 * @api {post} /users/profileCode
 * @apiDescription Get user detail by profile code
 * @apiVersion 1.0.0
 * @apiName GetUserByProfileCode
 * @apiGroup User
 * @apiPermission public
 *
 * @apiHeader {String}                  content-type         application/json
 *
 * @apiParam  {String}                  profileCode          User profile code
 *
 * @apiSuccess {String}                 message              Success message
 *
 * @apiError (Bad Request 400)          ValidationError     Some parameters may contain invalid values
 */
router.route('/:profileCode').get(controller.getUserByProfileCode);

/**
 * @api {post} /users/redeem-gift Redeem Gift
 * @apiDescription Redeem Gift
 * @apiVersion 1.0.0
 * @apiName RedeemGift
 * @apiGroup User
 * @apiPermission public
 *
 * @apiHeader {String}                  content-type        application/json
 *
 * @apiParam  {Number}                  campaignId            Campaign Id
 * @apiParam  {String}                  profileCode           User profile code
 * @apiParam  {String}                  passcode              Campaign passcode
 *
 * @apiSuccess {String}                 message             Success message
 *
 * @apiError (Bad Request 400)          ValidationError     Some parameters may contain invalid values
 */
router
  .route('/redeem-gift')
  .post(
    passport.authenticate('jwt', { session: false }),
    validate(redeemGift),
    controller.redeemGift,
  );

module.exports = router;
