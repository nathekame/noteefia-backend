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
    email: {
      type: type.STRING,
      isEmail: true,
      notEmpty: true,
      unique: true,
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
  return sequelize.define('senders', fields);
};
