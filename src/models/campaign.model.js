module.exports = (sequelize, Sequelize) => {
  const Campaign = sequelize.define(
    'campaigns',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(45),
        notEmpty: true,
      },
      uri: {
        type: Sequelize.STRING(45),
        notEmpty: true,
      },
      passcode: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        unique: true,
      },
      compliment: {
        type: Sequelize.DECIMAL(15, 2),
        notEmpty: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        notEmpty: true,
      },
    },
    {
      freezeTableName: true,
      tableName: 'campaigns',
    },
  );

  return Campaign;
};
