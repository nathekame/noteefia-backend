const Crypto = require('crypto');
const AWS = require('aws-sdk');
const sgMail = require('@sendgrid/mail');
const config = require('../config/secret');
const sequelize = require('../db/sequelize');

sgMail.setApiKey(config.sendgridKey);

// const dftTemplate = require('../templates/dft');
const userUtility = require('./userUtility');

// const sendersUtility = require('./sendersUtilitybk');

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
  // let getTemplate;

  // switch (emData.tempID) {
  //   case 'dft':
  //     getTemplate = await dftTemplate(emData);
  //     break;
  //   default:
  //     return true;
  // }

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
  // next();

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
      // console.log(`THE DATA RETURNED ==> ${JSON.stringify(resp)}`);

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
      // console.log(`THE ERROR LOG ===> ${JSON.stringify(err)}`);
      // console.error(err, err.stack);

      const rtObj = {
        isErr: true,
        reqID: err.requestId,
        errMsg: err.message,
        messageID: null,
        statusCode: err.statusCode,
      };

      return rtObj;
    });

  console.log(`the AWS SEND MAIL ===> ${JSON.stringify(sendPromise)}`);

  return sendPromise;
};

// const sendEmail = async (res, tempID, data) => {
//   let getTemplate;

//   switch (tempID) {
//     case 'dft':
//       getTemplate = await dftTemplate(data.body);
//       break;
//     default:
//       res.type('application/json');
//       return res.status(404).json({ msg: 'Template Not Found' });
//   }

//   const msg = {
//     to: { email: data.receiver, name: data.receiver },
//     from: { email: data.sender, name: data.sender },
//     subject: data.subject,
//     // html: getTemplate,
//     html: data.body,
//   };

//   const sendMail = sgMail.send(msg).then(
//     (resp) => resp,
//     (error) => {
//       if (error) {
//         return error;
//       }
//       return false;
//     },
//   );

//   const outPutSend = await sendMail;
//   return outPutSend;
// };

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
      // console.log(`THE DATA RETURNED ==> ${JSON.stringify(resp)}`);

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
      // console.log(`THE ERROR LOG ===> ${JSON.stringify(err)}`);
      // console.error(err, err.stack);
      const rtObj = {
        isErr: true,
        reqID: err.requestId,
        errMsg: err.message,
        messageID: null,
        statusCode: err.statusCode,
      };

      return rtObj;
    });

  console.log(`the AWS SEND MAIL ===> ${JSON.stringify(sendPromise)}`);

  return sendPromise;
};

const resendEmail = async (to, subject, body) => {
  const msg = {
    to,
    from: hostEmail,
    subject,
    html: body,
  };

  const sendMail = sgMail.send(msg).then(
    (resp) => {
      const re = resp;
      return re;
    },
    (error) => {
      if (error) {
        const er = error;
        return er;
      }
      return error;
    },
  );

  const outPutSend = sendMail;
  return outPutSend;
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
    },
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

      const msg = {
        to: userEmail,
        from: hostEmail,
        subject,
        html: body,
      };

      const sendMail = sgMail.send(msg).then(
        (resp) => true,
        (error) => {
          if (error) {
            return false;
          }
        },
      );

      const outPutSend = await sendMail;
      return outPutSend;
    }
  }
};

const sendPasswordResetEmail = async (uid) => {
  const userDetails = await userUtility.getUser(uid);
  const userEmail = userDetails.email;
  const subject = 'ITSMP Password Reset Email';

  const body = `Click on this <a href="${hostUrlclient}/passwordreset/${uid}">Link</a> to reset your password`;

  const msg = {
    to: userEmail,
    from: hostEmail,
    subject,
    html: body,
  };

  const sendMail = sgMail.send(msg).then(
    (resp) => true,
    (error) => {
      if (error) {
        return false;
      }
    },
  );

  const outPutSend = await sendMail;
  if (outPutSend) {
    return outPutSend;
  }
  //  }
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
      const body = ` Welcome to INEC Technical Staff Management Portal, Your Password Is ${password} ,
      
      Click on this <a href="${hostUrl}/api/verification_email?id=${uid}&token=${token}">Link</a> to verify your email and update you password`;

      const msg = {
        to: userEmail,
        from: hostEmail,
        subject,
        html: body,
      };

      const sendMail = sgMail.send(msg).then(
        (resp) => true,
        (error) => {
          if (error) {
            return false;
          }
        },
      );

      const outPutSend = await sendMail;
      return outPutSend;
    }
  }
};

// const domainSenderVerificationEmail = async (clientID, email) => {
//   const subject = 'Sender Verification Email';
//   const token = Crypto.randomBytes(21).toString('hex').slice(0, 21);

//   if (token) {
//     const data = {
//       clientID,
//       email,
//       confirmationToken: token,
//       isConfirmed: 0,
//       isBlocked: 0,
//     };

//     const createSender = await sendersUtility.createSender(data);

//     if (createSender) {
//       const { id } = createSender;
//       const body = `Click on this <a href="${hostUrl}/api/sender_verification_email?id=${id}&token=${token}">Link</a> to verify your email`;

//       const msg = {
//         to: email,
//         from: hostEmail,
//         subject,
//         html: body,
//       };

//       const sendMail = sgMail.send(msg).then(
//         (resp) => true,
//         (error) => {
//           if (error) {
//             return false;
//           }
//         },
//       );

//       const outPutSend = await sendMail;

//       if (outPutSend) {
//         return outPutSend;
//       }
//     }
//   }
//   return true;
// };

module.exports = {
  awssendEmail,
  // sendEmail,
  saveEmail,
  getAllEmails,
  getEmail,
  getEmailWithRecepient,
  getEmailWithclientID,
  getEmailWithEmailID,
  resendEmail,
  awsresendEmail,
  updateEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendVerificationAndPasswordEmail,
  // domainSenderVerificationEmail,
};