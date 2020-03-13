const moment = require('moment');
const jwt = require('jwt-simple');
const CONFIG = require('../config');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
        notEmpty: true,
      },
      campaignId: {
        type: Sequelize.INTEGER,
        notEmpty: true,
      },
      referrerId: {
        type: Sequelize.INTEGER,
        notEmpty: true,
      },
      name: {
        type: Sequelize.STRING(100),
        notEmpty: true,
      },
      mobile: {
        type: Sequelize.STRING(20),
        unique: true,
        notEmpty: true,
      },
      nationalityId: {
        type: Sequelize.INTEGER,
        notEmpty: true,
      },
      email: {
        type: Sequelize.STRING(100),
      },
      coverage: {
        type: Sequelize.DECIMAL(15, 2),
      },
      profileCode: {
        type: Sequelize.STRING(45),
        unique: true,
      },
      mobileVerified: {
        type: Sequelize.BOOLEAN,
      },
      registerOTP: {
        type: Sequelize.STRING(6),
        unique: true,
      },
      registerOTPExpires: {
        type: Sequelize.DATE,
      },
      hasRedeemed: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
    },
    {
      freezeTableName: true,
      tableName: 'users',
    },
  );

  User.associate = models => {
    User.belongsTo(models.campaigns, {
      foreignKey: 'campaignId',
    });
    User.belongsTo(models.products, {
      foreignKey: 'productId',
    });
    User.belongsTo(models.nationalities, {
      foreignKey: 'nationalityId',
    });
  };

  User.prototype.token = function () {
    const playload = {
      exp: moment()
        .add(CONFIG.jwt_expiration, 'minutes')
        .unix(),
      iat: moment().unix(),
      sub: this.id,
    };
    return jwt.encode(playload, CONFIG.jwt_encryption);
  };

  User.prototype.toWeb = function () {
    return this.toJSON();
  };

  return User;
};
