'use strict';
const emailer = require('./base-emailer');
const utils = require('../utils/EJS');
const CONFIG = require('../config');
const Helper = require('../utils/Helper');
/**
* Send email on successful registration
* @param {Object} data 
*/
exports.registrationConfirmationEmail = async (data) => {
    data.privacyUrl = CONFIG.privacy_url
    data.termsOfUse = CONFIG.terms_of_use
    data.webUrl = CONFIG.web_url
    data.shareUrl = Helper.shareLink(data.profileCode);

    var result = await utils.generateEmailEjsTemplate({
        template: 'registration-confirmation-email.ejs',
        data: data
    });

    if (result.status) {
        let options = {
            to: data.to,
            subject: "Welcome to NTUC",
            message: result.message
        };

        await emailer.sendEmail(options).then(object => {
            return object;
        }).catch(error => {
            return new Error('Something went wrong');
        });
    }
};


/**
* Send email on select product
* @param {Object} data 
*/
exports.selectProductEDM = async (data) => {
    data.privacyUrl = CONFIG.privacy_url
    data.termsOfUse = CONFIG.terms_of_use
    data.webUrl = CONFIG.web_url
    data.shareUrl = Helper.shareLink(data.profileCode);

    var result = await utils.generateEmailEjsTemplate({
        template: 'on-select-product-edm.ejs',
        data: data
    });

    if (result.status) {
        let options = {
            to: data.to,
            subject: data.title + ' Insurance Coverage',
            message: result.message
        };

        await emailer.sendEmail(options).then(object => {
            return object;
        }).catch(error => {
            return new Error('Something went wrong');
        });
    }

};
