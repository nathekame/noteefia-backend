const Crypto = require('crypto');
const AWS = require('aws-sdk');
const config = require('../config/secret');
const sequelize = require('../db/sequelize');

const userUtility = require('./userUtility');

const { hostEmail } = config;

// const hostUrl = process.env.HOST_URL;

const hostUrl = 'https://54.227.65.41';

const hostUrlclient = 'https://noteefia.com';

const SES_CONFIG = {
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: 'us-east-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);
const saveEmail = async (emData) => {
  const data = {
    clientID: emData.clientID,
    sender: emData.sender,
    receiver: emData.receiver,
    subject: emData.subject,
    host: emData.dhost,
    message: emData.body,
    messageID: emData.messageID,
    requestID: emData.requestID,
    statusCode: emData.scode,
  };

  const nEmail = sequelize.Emails.create(data)
    .then((newEmail) => {
      if (!newEmail) {
        return false;
      }

      if (newEmail) {
        return newEmail;
      }
      return true;
    })
    .catch((err) => {
      throw err;
    });

  const output = await nEmail;
  return output;
};

const awssendEmail = async (res, data) => {
  const params = {
    Source: data.sender,
    Destination: {
      ToAddresses: [data.receiver],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: data.body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: data.subject,
      },
    },
  };

  const sendPromise = AWS_SES.sendEmail(params)
    .promise()
    .then((resp) => {
      const rtObj = {
        isErr: false,
        reqID: resp.ResponseMetadata.RequestId,
        errMsg: null,
        messageID: resp.MessageId,
        statusCode: 201,
      };

      return rtObj;
    })
    .catch(async (err) => {
      const rtObj = {
        isErr: true,
        reqID: err.requestId,
        errMsg: err.message,
        messageID: null,
        statusCode: err.statusCode,
      };

      return rtObj;
    });

  return sendPromise;
};

const awsresendEmail = async (to, subject, body) => {
  const params = {
    Source: hostEmail,
    Destination: {
      ToAddresses: [to],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };
  const sendPromise = AWS_SES.sendEmail(params)
    .promise()
    .then((resp) => {
      const rtObj = {
        isErr: false,
        reqID: resp.ResponseMetadata.RequestId,
        errMsg: null,
        messageID: resp.MessageId,
        statusCode: 201,
      };

      return rtObj;
    })
    .catch((err) => {
      const rtObj = {
        isErr: true,
        reqID: err.requestId,
        errMsg: err.message,
        messageID: null,
        statusCode: err.statusCode,
      };

      return rtObj;
    });

  return sendPromise;
};
const getAllEmails = async () => {
  const { rows, count } = await sequelize.Emails.findAndCountAll()
    .then((emails) => {
      if (!emails) {
        return false;
      }
      return emails;
    })
    .catch((err) => {
      throw err;
    });

  const demails = {
    count,
    rows,
  };

  return demails;
};

const getEmail = async (id) => {
  const dEmail = await sequelize.Emails.findOne({ where: { id } })
    .then((email) => {
      if (!email) {
        return false;
      }

      return email;
    })
    .catch((err) => {
      throw err;
    });

  return dEmail;
};

const getEmailWithRecepient = async (receiver) => {
  const { rows, count } = await sequelize.Emails.findAndCountAll({
    where: { receiver },
  })
    .then((emails) => {
      if (!emails) {
        return false;
      }
      return emails;
    })
    .catch((err) => {
      throw err;
    });

  const demails = {
    count,
    rows,
  };

  return demails;
};

const getEmailWithclientID = async (clientID) => {
  const { rows, count } = await sequelize.Emails.findAndCountAll({
    where: { clientID },
  })
    .then((emails) => {
      if (!emails) {
        return false;
      }
      return emails;
    })
    .catch((err) => {
      throw err;
    });

  const demails = {
    count,
    rows,
  };

  return demails;
};

const getEmailWithEmailID = async (eid) => {
  const dEmail = await sequelize.Emails.findOne({ where: { emailID: eid } })
    .then((email) => {
      if (!email) {
        return false;
      }

      return email;
    })
    .catch((err) => {
      throw err;
    });

  return dEmail;
};

const updateEmail = async (id, col, val) => {
  const Udate = sequelize.Emails.update(
    {
      [col]: val,
    },
    {
      where: {
        id,
      },
    }
  )
    .then((uMeta) => {
      if (!uMeta) {
        return false;
      }

      if (uMeta) {
        return true;
      }
      return uMeta;
    })
    .catch((err) => {
      throw err;
    });

  const output = await Udate;
  return output;
};

const sendVerificationEmail = async (uid) => {
  const userDetails = await userUtility.getUser(uid);
  const userEmail = userDetails.email;
  const subject = 'Verification Email';

  const token = Crypto.randomBytes(21).toString('hex').slice(0, 21);

  if (token) {
    const key = 'confirmationToken';

    const createToken = await userUtility.updateUser(uid, key, token);

    if (createToken) {
      const body = `Click on this <a href="${hostUrl}/api/verification_email?id=${uid}&token=${token}">Link</a> to verify your email`;
      const params = {
        Source: hostEmail,
        Destination: {
          ToAddresses: [userEmail],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: body,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
      };
      const sendPromise = AWS_SES.sendEmail(params)
        .promise()
        .then((resp) => {
          const rtObj = {
            isErr: false,
            reqID: resp.ResponseMetadata.RequestId,
            errMsg: null,
            messageID: resp.MessageId,
            statusCode: 201,
          };

          return rtObj;
        })
        .catch((err) => {
          const rtObj = {
            isErr: true,
            reqID: err.requestId,
            errMsg: err.message,
            messageID: null,
            statusCode: err.statusCode,
          };

          return rtObj;
        });

      return sendPromise;
    }
  }
};

const sendPasswordResetEmail = async (uid) => {
  const userDetails = await userUtility.getUser(uid);
  const userEmail = userDetails.email;
  const subject = 'Noteefia Password Reset Email';

  const body = `Click on this <a href="${hostUrlclient}/passwordreset/${uid}">Link</a> to reset your password`;
  const params = {
    Source: hostEmail,
    Destination: {
      ToAddresses: [userEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };
  const sendPromise = AWS_SES.sendEmail(params)
    .promise()
    .then((resp) => {
      const rtObj = {
        isErr: false,
        reqID: resp.ResponseMetadata.RequestId,
        errMsg: null,
        messageID: resp.MessageId,
        statusCode: 201,
      };

      return rtObj;
    })
    .catch((err) => {
      const rtObj = {
        isErr: true,
        reqID: err.requestId,
        errMsg: err.message,
        messageID: null,
        statusCode: err.statusCode,
      };

      return rtObj;
    });

  return sendPromise;
};

const sendVerificationAndPasswordEmail = async (uid, password) => {
  const userDetails = await userUtility.getUser(uid);
  const userEmail = userDetails.email;
  const subject = 'Verification Email';
  const token = Crypto.randomBytes(21).toString('hex').slice(0, 21);

  if (token) {
    const key = 'confirmationToken';

    const createToken = await userUtility.updateUser(uid, key, token);

    if (createToken) {
      const body = ` Welcome to Noteefia Portal, Your Password Is ${password} ,
      
      Click on this <a href="${hostUrl}/api/verification_email?id=${uid}&token=${token}">Link</a> to verify your email and update you password`;

      const params = {
        Source: hostEmail,
        Destination: {
          ToAddresses: [userEmail],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: body,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
      };
      const sendPromise = AWS_SES.sendEmail(params)
        .promise()
        .then((resp) => {
          const rtObj = {
            isErr: false,
            reqID: resp.ResponseMetadata.RequestId,
            errMsg: null,
            messageID: resp.MessageId,
            statusCode: 201,
          };

          return rtObj;
        })
        .catch((err) => {
          const rtObj = {
            isErr: true,
            reqID: err.requestId,
            errMsg: err.message,
            messageID: null,
            statusCode: err.statusCode,
          };

          return rtObj;
        });

      return sendPromise;
    }
  }
};

module.exports = {
  awssendEmail,
  saveEmail,
  getAllEmails,
  getEmail,
  getEmailWithRecepient,
  getEmailWithclientID,
  getEmailWithEmailID,
  awsresendEmail,
  updateEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendVerificationAndPasswordEmail,
};
