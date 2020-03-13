const Joi = require('joi');

module.exports = {
  // POST /users/register
  register: {
    body: {
      // productId: Joi.number().required(),
      // campaignId: Joi.number().required(),
      // referrerId: Joi.number().required(),
      name: Joi.string()
        .max(100)
        .required(),
      mobile: Joi.string()
        .max(20)
        .required(),
      nationalityId: Joi.number().required(),
    },
  },

  // POST /users/resend-otp
  resend: {
    body: {
      mobile: Joi.string()
        .max(20)
        .required(),
    },
  },

  // POST /users/verify-otp
  verify: {
    body: {
      mobile: Joi.string()
        .max(20)
        .required(),
      otp: Joi.string()
        .max(6)
        .required(),
    },
  },

  // PATCH /users/:id
  update: {
    body: {
      productId: Joi.number(),
      campaignId: Joi.number(),
      referrerId: Joi.number(),
      name: Joi.string().max(100),
      mobile: Joi.string().max(20),
      nationalityId: Joi.number(),
      email: Joi.string().max(100),
    },
  },
  // POST /users/redeem-gift
  redeemGift: {
    body: {
      campaignId: Joi.number().required(),
      profileCode: Joi.string().required(),
      passcode: Joi.string().required(),
    },
  },
};
