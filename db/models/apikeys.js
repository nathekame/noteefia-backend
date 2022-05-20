module.exports = (sequelize, type) => {
  const fields = {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientID: {
      type: type.INTEGER,
      notEmpty: true,
    },
    key: {
      type: type.STRING,
      notEmpty: true,
      unique: true,
    },
    status: {
      type: type.INTEGER,
      notEmpty: true,
    },
  };
  return sequelize.define('apikeys', fields);
};
