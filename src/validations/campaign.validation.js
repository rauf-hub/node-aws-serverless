const Joi = require('joi');

module.exports = {
  checkCampaign: {
    body: {
      profileCode: Joi.string().required(),
    },
  },
};
