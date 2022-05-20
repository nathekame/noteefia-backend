module.exports = (sequelize, type) => {
  const fields = {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    keyID: {
      type: type.STRING,
      notEmpty: true,
    },
    receiver: {
      type: type.STRING,
      isEmail: true,
      notEmpty: true,
    },
    messageId: {
      type: type.STRING,
      notEmpty: true,
    },
    message: {
      type: type.TEXT,
      notEmpty: true,
    },
    eventStatus: {
      type: type.TEXT,
      notEmpty: true,
    },
    statusCode: {
      type: type.INTEGER,
      notEmpty: true,
    },
  };
  return sequelize.define('sms', fields);
};
