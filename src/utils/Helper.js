'use strict';
const CONFIG = require('../config');

exports.shareLink = (profileCode) => {
    const webUrl = CONFIG.web_url;
    return webUrl + '/' + profileCode;
};