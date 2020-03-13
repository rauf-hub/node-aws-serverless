const moment = require('moment');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define(
    'refreshToken',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        notEmpty: true,
      },
      userMobile: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      expires: {
        type: Sequelize.DATE,
      },
    },
    {
      freezeTableName: true,
      tableName: 'refreshToken',
    },
  );

  RefreshToken.generate = function(user) {
    console.log('userID', user.id);
    const userId = user.id;
    const userMobile = user.mobile;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment()
      .add(30, 'days')
      .toDate();
    const tokenObject = new RefreshToken({
      token,
      userId,
      userMobile,
      expires,
    });
    tokenObject.save();
    return tokenObject;
  };

  return RefreshToken;
};
