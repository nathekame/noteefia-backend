/* eslint-disable no-console */
const Sequelize = require('sequelize');

const userModel = require('./models/users');
const usermetaModel = require('./models/usermeta');
const emailModel = require('./models/emails');
const smsModel = require('./models/smsBK');
const apiKeysModel = require('./models/apikeys');

const clientsModel = require('./models/clients');

const config = require('../config/secret');

const sequelize = new Sequelize(
  config.database,
  config.dbUser,
  config.dbPassword,
  {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {})
  .catch((err) => {
    if (err) {
      throw err;
    }
  });

const User = userModel(sequelize, Sequelize);
const Usermeta = usermetaModel(sequelize, Sequelize);
const Emails = emailModel(sequelize, Sequelize);
const Sms = smsModel(sequelize, Sequelize);
const Apikeys = apiKeysModel(sequelize, Sequelize);

const Clients = clientsModel(sequelize, Sequelize);

sequelize.sync({ force: false }).then(() => {
  // console.clear();
  console.log('Database & tables created Successfully!');
});

module.exports = {
  User,
  Usermeta,
  Emails,
  Sms,
  Apikeys,

  Clients,
};
