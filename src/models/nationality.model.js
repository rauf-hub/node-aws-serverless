module.exports = (sequelize, Sequelize) => {
  const Nationality = sequelize.define(
    'nationalities',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(50),
        notEmpty: true,
      },
    },
    {
      freezeTableName: true,
      tableName: 'nationalities',
    },
  );

  return Nationality;
};
