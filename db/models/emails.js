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
    host: {
      type: type.STRING,
      notEmpty: true,
    },
    sender: {
      type: type.STRING,
      isEmail: true,
      notEmpty: true,
    },
    receiver: {
      type: type.STRING,
      isEmail: true,
      notEmpty: true,
    },
    subject: {
      type: type.STRING,
      notEmpty: true,
    },
    message: {
      type: type.TEXT,
      notEmpty: true,
    },
    emailID: {
      type: type.TEXT,
      notEmpty: true,
    },
    tempID: {
      type: type.TEXT,
      notEmpty: true,
    },
    statusCode: {
      type: type.INTEGER,
      notEmpty: true,
    },
  };
  return sequelize.define('emails', fields);
};
