const httpStatus = require('http-status');
const crypto = require('crypto');
const moment = require('moment');
const AWS = require('aws-sdk');
const generateOTP = require('../utils/OTPGenerator');
const RefreshToken = require('../models').refreshToken;
const User = require('../models').users;
const Product = require('../models').products;
const Campaign = require('../models').campaigns;
const CONFIG = require('../config');
const Email = require('../services/email');
const Sequelize = require('sequelize');
// const { handler: errorHandler } = require('../middleware/error');

AWS.config.update({
  region: CONFIG.region,
  accessKeyId: CONFIG.accessKey,
  secretAccessKey: CONFIG.secretKey,
});

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(CONFIG.jwt_expiration, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Send verification OTP
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    if (req.body && req.body.referrerProfileCode) {
      const referrerUser = await User.findOne({
        where: { profileCode: req.body.referrerProfileCode },
      });
      if (referrerUser) {
        req.body.referrerId = referrerUser.id;
      } else {
        return res.json({
          code: 400,
          message: 'Invalid referrer profile code',
        });
      }
    }
    // Assign Campaign
    const campaign = await Campaign.findOne({ where: { is_active: 1 } });
    req.body.campaignId = campaign.id;

    const userInfo = {
      ...req.body,
      registerOTP: generateOTP(),
      registerOTPExpires: moment().add(CONFIG.opt_expiration, 'minutes'),
      profileCode: crypto.randomBytes(3).toString('hex'),
    };

    const user = User.build(userInfo);
    const savedUser = await user.save();

    const sns = new AWS.SNS();

    const params = {
      Message: `Your verification code is ${savedUser.registerOTP}`,
      MessageStructure: 'string',
      PhoneNumber: savedUser.mobile,
    };
    sns.publish(params, (err, data) => {
      if (err) console.log(err);
      else console.log(data);
    });

    res.status(httpStatus.CREATED);
    return res.json({
      message: 'Your verification code is sent',
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

/**
 * resend verification OTP
 * @public
 */
exports.resendOTP = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ where: { mobile } });

    if (user) {
      user.registerOTP = generateOTP();
      user.registerOTPExpires = moment().add(CONFIG.opt_expiration, 'minutes');
      const savedUser = await user.save();

      const sns = new AWS.SNS();
      const params = {
        Message: `Your verification code is ${savedUser.registerOTP}`,
        MessageStructure: 'string',
        PhoneNumber: savedUser.mobile,
        Subject: 'Your verification code',
      };
      sns.publish(params, (err, data) => {
        if (err) console.log(err);
        else console.log(data);
      });

      return res.json({
        message: 'Your verification code is sent',
      });
    }
    return next(new Error('User does not exist'));
  } catch (error) {
    return next(new Error('User does not exist'));
  }
};

/**
 * Verify OTP code and returns jwt token if registration was successful
 * @public
 */
exports.verifyOTP = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;
    console.log(mobile, otp);
    const user = await User.findOne({ where: { mobile } });
    console.log(moment().unix(), moment(user.registerOTPExpires).unix());
    if (user) {
      if (
        otp === user.registerOTP &&
        moment().unix() < moment(user.registerOTPExpires).unix()
      ) {
        // user.registerOTP = '';
        // user.registerOTPExpires = '';
        user.mobileVerified = true;
        const savedUser = await user.save();

        const token = generateTokenResponse(user, user.token());

        return res.json({ token, user: savedUser.toWeb() });
      }
      return next(new Error('OTP is invalid'));
    }
    return next(new Error('User does not exist'));
  } catch (error) {
    console.log(error);
    return next(new Error('User does not exist'));
  }
};

/**
 * Get user by profile codes
 */
exports.getUserByProfileCode = async (req, res, next) => {
  try {
    const { profileCode } = req.params;
    const user = await User.findOne({
      where: { profileCode },
      include: [{ model: Product }],
    });
    if (user) {
      return res.json({ code: 200, data: user, message: null });
    } else {
      return next(new Error('Invalid profile code.'));
    }
  } catch (error) {
    return next(error);
  }
};
/**
 * Check email exists
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */
exports.checkEmailExists = async (req, res, next) => {
  const Op = Sequelize.Op;
  let bodyData = req.body;
  let email = bodyData.email;

  if (email) {
    let where = { email: email };

    // Condition for edit user
    if (req.params.id) {
      where.id = { [Op.ne]: req.params.id };
    }
    if (bodyData.id) {
      where.id = { [Op.ne]: bodyData.id };
    }
    User.findOne({ where })
      .then(user => {
        if (user) {
          res.status(400).json({
            success: false,
            data: null,
            message: 'Email already exists.',
          });
        } else {
          return next();
        }
      })
      .catch(error => {
        next(error);
      });
  } else {
    return next();
  }
};
/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
      include: [{ model: Product }],
    });

    const userEmail = user ? user.email : '';
    const userProductId = user ? user.productId : '';
    const savedUser = await user.update(req.body);

    if (
      req.body.email &&
      (userEmail === '' || userEmail == null) &&
      savedUser.email !== ''
    ) {
      await Email.registrationConfirmationEmail({
        to: req.body.email,
        profileCode: savedUser.profileCode,
        name: savedUser.name,
      })
        .then(() => {
          return res.json({
            code: 200,
            data: savedUser.toWeb(),
            message: 'Email has been sent at your registered email.',
          });
        })
        .catch(e => next(e));
      return;
    }

    if (
      req.body.productId &&
      !userProductId &&
      savedUser.productId != '' &&
      savedUser.email !== ''
    ) {
      const product = await Product.findOne({
        where: { id: req.body.productId },
      });
      product.to = savedUser.email;
      product.profileCode = savedUser.profileCode;
      await Email.selectProductEDM(product)
        .then(data => {
          return res.json({
            code: 200,
            data: savedUser.toWeb(),
            message: 'Insurance email sent.',
          });
        })
        .catch(e => next(e));
      return;
    }

    return res.json({ code: 200, data: savedUser.toWeb() });
  } catch (error) {
    return next(error);
  }
};

/**
 * Redeem Gift
 * @public
 */
exports.redeemGift = async (req, res, next) => {
  try {
    const { profileCode, campaignId, passcode } = req.body;
    const where = { id: campaignId, is_active: 1 };
    const campaign = await Campaign.findOne({ where });

    if (campaign) {
      if (campaign.passcode != passcode) {
        return next(new Error('Passcode does not match'));
      }
      const user = await User.findOne({ where: { profileCode } });
      if (!user) return next(new Error('Invalid profile code.'));

      if (!user.hasRedeemed) {
        const savedUser = await user.update({ hasRedeemed: 1 });
        return res.json({
          code: 200,
          data: savedUser,
          message: 'you have successfully redeemed gift.',
        });
      }
      return next(new Error('You have already redeemed this gift.'));
    }
    return next(new Error('Campaign does not exist.'));
  } catch (error) {
    return next(error);
  }
};
