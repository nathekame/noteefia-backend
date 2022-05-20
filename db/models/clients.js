module.exports = (sequelize, type) => {
  const fields = {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: type.STRING,
      notEmpty: true,
    },
    url: {
      type: type.STRING,
      notEmpty: true,
      unique: true,
    },
    isBlocked: {
      type: type.INTEGER,
      notEmpty: true,
    },
  };
  return sequelize.define('clients', fields);
};
