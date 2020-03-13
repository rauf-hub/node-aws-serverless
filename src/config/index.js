const path = require('path');

require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

const CONFIG = {};

CONFIG.db_dialect = process.env.DB_DIALECT;
CONFIG.db_host = process.env.DB_HOST;
CONFIG.db_port = process.env.DB_PORT;
CONFIG.db_name = process.env.DB_NAME;
CONFIG.db_user = process.env.DB_USERNAME;
CONFIG.db_password = process.env.DB_PASSWORD;
CONFIG.db_connection_limit = process.env.DB_CONNECTION_LIMIT;

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION;
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION;

CONFIG.opt_expiration = process.env.OTP_EXPIRATION;

CONFIG.account_id = process.env.AWS_ACCOUNT_ID;
CONFIG.region = process.env.AWS_REGION;
CONFIG.accessKey = process.env.AWS_ACCESS_KEY;
CONFIG.secretKey = process.env.AWS_SECRET_KEY;

CONFIG.fromEmail = process.env.FROM_EMAIL;
CONFIG.web_url = process.env.WEB_URL;
CONFIG.privacy_url = 'https://www.income.com.sg/privacy-policy';
CONFIG.terms_of_use = 'https://www.income.com.sg/terms-of-use';

module.exports = CONFIG;
