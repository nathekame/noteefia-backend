module.exports = (sequelize, type) => {
  const fields = {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: type.STRING,
      isEmail: true,
      notEmpty: true,
      unique: true,
    },
    password: {
      type: type.STRING,
      notEmpty: true,
    },
    confirmationToken: {
      type: type.STRING,
      notEmpty: true,
    },
    isConfirmed: {
      type: type.STRING,
      notEmpty: true,
    },
    isBlocked: {
      type: type.STRING,
      notEmpty: true,
    },
  };
  return sequelize.define('users', fields);
};
