const sequelize = require('../db/sequelize');

// const vprTemplate = require('../smstemplates/vpr');
// const vrcTemplate = require('../smstemplates/vrc');
// const rimTemplate = require('../smstemplates/rim');
// const rcnTemplate = require('../smstemplates/rcn');
// const ucnTemplate = require('../smstemplates/ucn');
// const tcnTemplate = require('../smstemplates/tcn');
// const dftTemplate = require('../smstemplates/dft');
const config = require('../config/secret');

// const credentials = {
//   apiKey: 'b34064b8f8a2a4f4b589b24ca9cd0c429f12b633bbb92ad74cb2d1d685ab24ba',
//   username: 'nbabroadcast',
//   // format: 'json',
// };

const credentials = {
  apiKey: '617d112d5f497c69dc89b977292100de3a1265106704e92a9035aee624ad1750',
  username: 'noteefia',
  // format: 'json',
};

const Africastalking = require('africastalking')(credentials);

const sms = Africastalking.SMS;

const sendSMS = async (recepient, msg) => {
  let getTemplate;

  //   switch (tempID) {
  //     case 'vpr':
  //       getTemplate = await vprTemplate(data.params);
  //       break;
  //     case 'vrc':
  //       getTemplate = await vrcTemplate(data.params);
  //       break;
  //     case 'rim':
  //       getTemplate = await rimTemplate(data.params);
  //       break;
  //     case 'rcn':
  //       getTemplate = await rcnTemplate(data.params);
  //       break;
  //     case 'ucn':
  //       getTemplate = await ucnTemplate(data.params);
  //       break;
  //     case 'tcn':
  //       getTemplate = await tcnTemplate(data.params);
  //       break;
  //     case 'dft':
  //       getTemplate = await dftTemplate(data.params);
  //       break;
  //     default:
  //       res.type('application/json');
  //       return res.status(404).json({ msg: 'Template Not Found' });
  //   }

  const options = {
    to: recepient,
    message: msg,
    enqueue: true,
  };

  const sendMsg = sms
    .send(options)
    .then((response) => {
      const resp = response;
      console.log(`THE RESP ==> ${JSON.stringify(resp)}`);

      return resp;
    })
    .catch((error) => {
      if (error) {
        const er = error;
        console.log(`THE ERROR ==> ${JSON.stringify(er)}`);
        return er;
      }
      return false;
    });

  const outPutSend = await sendMsg;
  return outPutSend;
};

const saveSMS = async (smData) => {
  // let getTemplate;

  // switch (smData.tempID) {
  //   case 'vpr':
  //     getTemplate = await vprTemplate(smData.params);
  //     break;
  //   case 'vrc':
  //     getTemplate = await vrcTemplate(smData.params);
  //     break;
  //   case 'rim':
  //     getTemplate = await rimTemplate(smData.params);
  //     break;
  //   case 'rcn':
  //     getTemplate = await rcnTemplate(smData.params);
  //     break;
  //   case 'ucn':
  //     getTemplate = await ucnTemplate(smData.params);
  //     break;
  //   case 'tcn':
  //     getTemplate = await tcnTemplate(smData.params);
  //     break;
  //   case 'dft':
  //     getTemplate = await dftTemplate(smData.params);
  //     break;
  //   default:
  //     return true;
  // }

  // const data = {
  //   clientID: smData.clientID,
  //   receiver: smData.receiver,
  //   messageId: smData.messageId,
  //   message: getTemplate,
  //   statusCode: smData.scode,
  // };

  const nSms = sequelize.Sms.create(smData)
    .then((newSms) => {
      if (!newSms) {
        return false;
      }

      if (newSms) {
        return newSms;
      }
      return true;
    })
    .catch((err) => {
      throw err;
    });

  const output = await nSms;
  return output;
};

const getAllSms = async () => {
  const { rows, count } = await sequelize.Sms.findAndCountAll({
    raw: true,
    order: [['createdAt', 'DESC']],
  })
    .then((dsms) => {
      if (!dsms) {
        return false;
      }
      return dsms;
    })
    .catch((err) => {
      throw err;
    });

  const smss = {
    count,
    rows,
  };

  return smss;
};

const getSms = async (id) => {
  const dSMS = await sequelize.Sms.findOne({ where: { id } })
    .then((Sms) => {
      if (!Sms) {
        return false;
      }

      return Sms;
    })
    .catch((err) => {
      throw err;
    });

  return dSMS;
};

const getSmsWithClientID = async (clientID) => {
  const { rows, count } = await sequelize.Sms.findAndCountAll({
    where: { clientID },
    order: [['createdAt', 'DESC']],
  })
    .then((Sms) => {
      if (!Sms) {
        return false;
      }
      return Sms;
    })
    .catch((err) => {
      throw err;
    });

  const dsms = {
    count,
    rows,
  };

  return dsms;
};

const getSmsWithRecepient = async (receiver) => {
  const { rows, count } = await sequelize.Sms.findAndCountAll({
    where: { receiver },
    order: [['createdAt', 'DESC']],
  })
    .then((Sms) => {
      if (!Sms) {
        return false;
      }
      return Sms;
    })
    .catch((err) => {
      throw err;
    });

  const dsms = {
    count,
    rows,
  };

  return dsms;
};

const updateSms = async (id, col, val) => {
  const Udate = sequelize.Sms.update(
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

const resendSms = async (to, message) => {
  const options = {
    to,
    message,
    enqueue: true,
  };

  const sendMsg = sms
    .send(options)
    .then((response) => {
      const res = response;
      return res;
    })
    .catch((error) => {
      if (error) {
        const err = error;
        return err;
      }
      return false;
    });

  const outPutSend = await sendMsg;
  return outPutSend;
};

const getSmsWithMessageID = async (id) => {
  const dSMS = await sequelize.Sms.findOne({ where: { messageId: id } })
    .then((Sms) => {
      if (!Sms) {
        return false;
      }

      return Sms;
    })
    .catch((err) => {
      throw err;
    });

  return dSMS;
};

module.exports = {
  sendSMS,
  saveSMS,
  getAllSms,
  getSms,
  getSmsWithClientID,
  getSmsWithRecepient,
  updateSms,
  resendSms,
  getSmsWithMessageID,
};
