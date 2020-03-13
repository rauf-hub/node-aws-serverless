'use strict';
const AWS = require('aws-sdk');
const CONFIG = require('../config');

AWS.config.update({
  region: CONFIG.region,
  accessKeyId: CONFIG.accessKey,
  secretAccessKey: CONFIG.secretKey,
});

exports.sendEmail = async (options) => {
  try {
    const ses = new AWS.SES();
    const params = {
      Destination: {
        ToAddresses: [options.to] // Email address/addresses that you want to send your email
      },
      Message: {
        Body: {
          Html: {
            // HTML Format of the email
            Charset: "UTF-8",
            Data: options.message
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: options.subject
        }
      },
      Source: CONFIG.fromEmail
    };

    const sendEmail = await ses.sendEmail(params).promise();
    sendEmail
      .then(data => {
        return data;
      })
      .catch(error => {
        return next(error);
      });
  } catch (error) {
    return next(error);
  }
}
