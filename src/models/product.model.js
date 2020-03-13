module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    'products',
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
      description: {
        type: Sequelize.TEXT,
        notEmpty: true,
      },
      image: {
        type: Sequelize.STRING(100),
        notEmpty: true,
      },
    },
    {
      freezeTableName: true,
      tableName: 'products',
    },
  );

  return Product;
};
