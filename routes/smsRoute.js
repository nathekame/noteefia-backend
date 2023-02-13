const R = require('ramda');
// const crypto = require('crypto');
const smsUtility = require('../utility/smsUtility');
const clientUtility = require('../utility/clientsUtility');
// const axiosUtility = require('../utility/axiosUtility');
// const config = require('../config/secret');

const smsGET = async (req, res) => {
  const getSMS = await smsUtility.getAllSms();

  const dArr = getSMS.rows;
  const dCount = getSMS.count;

  const newArr = [];

  for (let i = 0; i < dCount; i++) {
    const element = dArr[i];

    const getClient = await clientUtility.getClientWITHID(element.clientID);

    const newObj = { ...element, client: getClient };

    newArr.push(newObj);
  }

  if (!R.isEmpty(newArr)) {
    res.type('application/json');
    return res.status(201).json(newArr);
  }

  return true;
};

const smsPOST = async (req, res) => {
  const { recepient, body } = req.body;

  //   const triggerSMS = await smsUtility.sendSMS(res, tempID, data);

  const cID = Number(res.locals.clientID);

  const getClient = await clientUtility.getClientWITHID(cID);

  const isBlocked = Number(getClient.isBlocked);

  // const isBlocked = 0;

  if (isBlocked === 0) {
    const triggerSMS = await smsUtility.sendSMS(recepient, body);
    setInterval(async () => {
      const getSms = await smsUtility.getAllSms();
      const smsRow = getSms.rows;

      const runResend = async (id, receiver, message) => {
        const resendSms = await smsUtility.resendSms(receiver, message);
        if (resendSms.SMSMessageData.Recipients[0] !== undefined) {
          await smsUtility.updateSms(
            id,
            'statusCode',
            resendSms.SMSMessageData.Recipients[0].statusCode
          );
        }
      };

      if (smsRow !== undefined) {
        for (let i = 0; i < smsRow.length; i++) {
          const {
 id, receiver, message, statusCode 
} = smsRow[i];

          if (statusCode !== 102) {
            runResend(id, receiver, message);
          }
        }
      }
    }, 60000);

    if (triggerSMS.SMSMessageData !== undefined) {
      const {
 messageId, messageParts, cost, number, status, statusCode 
} =        triggerSMS.SMSMessageData.Recipients[0];

      const smData = {
        clientID: cID,
        // clientID: 1,
        receiver: number,
        messageId,
        message: body,
        messageParts,
        cost,
        status,
        statusCode,
      };

      const saveSms = await smsUtility.saveSMS(smData);
      if (saveSms) {
        res.type('application/json');
        return res.status(201).json(saveSms);
      }
    }
  }

  if (isBlocked === 1) {
    res.type('application/json');
    return res.status(200).json({ msg: 'Client Account Blocked' });
  }

  return true;
};

const singleSmsGET = async (req, res) => {
  const smsID = req.params.id;

  const getSMS = await smsUtility.getSms(smsID);

  const getUsername = await clientUtility.getClientByID(getSMS.clientID);

  const output = {};

  output.id = getSMS.id;
  output.clientID = getSMS.clientID;
  output.clientName = getUsername;
  output.receiver = getSMS.receiver;
  output.messageId = getSMS.messageId;
  output.message = getSMS.message;
  output.statusCode = getSMS.statusCode;
  output.createdAt = getSMS.createdAt;
  output.updatedAt = getSMS.updatedAt;

  if (getSMS) {
    res.type('application/json');
    return res.status(201).json(output);
  }

  return true;
};

const smsByClient = async (req, res) => {
  const clientName = req.params.name;

  const getClient = await clientUtility.getClientByName(clientName);

  const clientID = getClient.id;

  const getClientSms = await smsUtility.getSmsWithClientID(clientID);

  if (getClientSms) {
    res.type('application/json');
    return res.status(201).json(getClientSms);
  }

  return true;
};

const smsByRecepient = async (req, res) => {
  const recepient = req.params.sms;

  const getRecepientSms = await smsUtility.getSmsWithRecepient(recepient);

  if (getRecepientSms) {
    res.type('application/json');
    return res.status(201).json(getRecepientSms);
  }

  return true;
};

// const smswebhookPOST = async (req, res) => {
//   console.log(
//     `THEY HAVE GOTTEN TO ME IN THE HOOK OOOOOOO ===>> ${JSON.stringify(
//       req.body
//     )}`,
//   );
//   const getStatCode = async (stat) => {
//     // Sent: The message has successfully been sent by our network.
//     // Submitted: The message has successfully been submitted to the MSP (Mobile Service Provider).
//     // Buffered: The message has been queued by the MSP.
//     // Rejected: The message has been rejected by the MSP. This is a final status.
//     // Success: The message has successfully been delivered to the receiver’s handset. This is a final status.
//     // Failed

//     switch (stat) {
//       case 'Sent':
//         return 1;
//       case 'Submitted':
//         return 2;
//       case 'Buffered':
//         return 3;
//       case 'Rejected':
//         return 4;
//       case 'Success':
//         return 5;
//       case 'Failed':
//         return 6;
//       default:
//         return 1;
//     }
//   };

//   const dEvent = req.body;

//   const getSMS = await smsUtility.getSmsWithMessageID(dEvent.id);

//   const atSMSStatCode = await getStatCode(dEvent.status);

//   if (getSMS.status !== 5) {
//     await smsUtility.updateSms(getSMS.id, 'eventStatus', atSMSStatCode);

//     if (getSMS.evenStatus !== atSMSStatCode) {
//       const getUrl = await clientUtility.getClientByID(getSMS.clientID);

//       console.log(`THIS I STHE GET URL${JSON.stringify(getUrl)}`);

//       // post the status data to the follwing url webhook
//       const { url } = getUrl;

//       const text = JSON.stringify({
//         id: getSMS.messageId, // 'emailID',
//         clientID: getSMS.clientID, // 'clientServiceID',
//         receiver: getSMS.receiver,
//         // subject: getSMS.subject, // 'emailSubject',
//         message: getSMS.message, // 'entireMessageBody',
//         createdAt: getSMS.createdAt, // 'timeOfInsert/timeEmailWasSent',
//         updatedAt: getSMS.updatedAt, // 'timeOfUpdateInDB',
//         deliveryStatus: atSMSStatCode, // 'pending',
//       });
//       const hash = crypto.createHmac('sha512', config.hookkey);
//       hash.update(text);
//       const signature = hash.digest('hex');

//       const options = {
//         headers: {
//           HTTP_X_API_SIGNATURE: signature,
//         },
//       };
//       const sendStatus = await axiosUtility.postRequest(url, text, options);

//       if (sendStatus) {
//         res.type('application/json');
//         return res.status(201).json('event received and logged');
//       }
//     }
//   }

//   if (req.body) {
//     res.type('application/json');
//     return res.status(201).json('event received');
//   }
// };

module.exports = {
  smsGET,
  smsPOST,
  singleSmsGET,
  smsByClient,
  smsByRecepient,
  // smswebhookPOST,
};
