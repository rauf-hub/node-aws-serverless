const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);
const CONFIG = require('../config');

console.log('connecting to mysql ...');
const sequelize = new Sequelize(
  CONFIG.db_name,
  CONFIG.db_user,
  CONFIG.db_password,
  {
    host: CONFIG.db_host,
    dialect: CONFIG.db_dialect,
    port: CONFIG.db_port,
    operatorsAliases: false,
    omitNull: false,
    define: {
      underscoredAll: true,
    },
    logging: false,
  },
);

const db = {};

/**
 * Read models files and create associations
 */
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
