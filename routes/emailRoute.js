const emailUtility = require('../utility/emailUtility');
const clientUtility = require('../utility/clientsUtility');
const userUtility = require('../utility/userUtility');
const sendersUtility = require('../utility/sendersUtility');
const config = require('../config/secret');

const mailGET = async (req, res) => {
  const getEmail = await emailUtility.getAllEmails();

  if (getEmail) {
    res.type('application/json');
    return res.status(201).json(getEmail);
  }

  return true;
};

const mailPOST = async (req, res) => {
  const { tempID } = req.body;
  const { subject } = req.body;
  const { body } = req.body;
  const { receiver } = req.body;
  const { sender } = req.body;

  const checkSender = await sendersUtility.getSenderWITHEMAIL(sender);

  const keyClientID = Number(res.locals.clientID);
  const senderClientID = Number(checkSender.clientID);
  const confirmed = Number(checkSender.isConfirmed);
  const blocked = Number(checkSender.isBlocked);

  if (keyClientID === senderClientID && blocked === 0 && confirmed === 1) {
    const data = {
      sender,
      receiver,
      subject,
      body,
    };

    const tempid = tempID || 'dft';

    const triggerEmail = await emailUtility.sendEmail(res, tempid, data);

    setInterval(async () => {
      const getEmails = await emailUtility.getAllEmails();
      const emailRow = getEmails.rows;

      const runResend = async (id, rec, sub, mess) => {
        const resendEmail = await emailUtility.resendEmail(rec, sub, mess);

        if (resendEmail[0] !== undefined) {
          await emailUtility.updateEmail(
            id,
            'statusCode',
            resendEmail[0].statusCode
          );
        }
      };

      if (emailRow !== undefined) {
        for (let i = 0; i < emailRow.length; i++) {
          const {
            id,
            receiver: rec,
            subject: subj,
            message: mes,
            statusCode,
          } = emailRow[i];

          if (statusCode === 500 || statusCode === 503 || statusCode === 429) {
            runResend(id, rec, subj, mes);
          }
        }
      }
    }, 60000);

    if (triggerEmail[0] !== undefined) {
      const scode = triggerEmail[0].statusCode;
      const emailID = triggerEmail[0].headers['x-message-id'];

      const emData = {
        clientID: res.locals.clientID,
        dhost: res.locals.dhost,
        sender,
        receiver,
        subject,
        body,
        emailID,
        tempID: tempID || 'dft',
        scode,
      };

      const saveEmail = await emailUtility.saveEmail(emData);
      if (saveEmail) {
        res.type('application/json');
        return res.status(201).json(saveEmail);
      }
    }
  }

  return true;
};

const singleMailGET = async (req, res) => {
  const emailID = req.params.id;

  const getEmail = await emailUtility.getEmail(emailID);

  const getUsername = await clientUtility.getSenderWITHUID(getEmail.clientID);

  const output = {};

  output.id = getEmail.id;
  output.clientID = getEmail.clientID;
  output.clientName = getUsername;
  output.receiver = getEmail.receiver;
  output.subject = getEmail.subject;
  output.message = getEmail.message;
  output.createdAt = getEmail.createdAt;
  output.updatedAt = getEmail.updatedAt;

  if (getEmail) {
    res.type('application/json');
    return res.status(201).json(output);
  }

  return true;
};

const mailByRecepient = async (req, res) => {
  const recepient = req.params.email;

  const getRecEmails = await emailUtility.getEmailWithRecepient(recepient);

  if (getRecEmails) {
    res.type('application/json');
    return res.status(201).json(getRecEmails);
  }

  return true;
};

const mailByClient = async (req, res) => {
  const clientName = req.params.name;

  const getClient = await clientUtility.getClientByName(clientName);

  const clientID = getClient.id;

  const getClientEmails = await emailUtility.getEmailWithclientID(clientID);

  if (getClientEmails) {
    res.type('application/json');
    return res.status(201).json(getClientEmails);
  }

  return true;
};

const verificationLinkEmail = async (req, res) => {
  const { id } = req.body;

  const sendVEmail = await emailUtility.sendVerificationEmail(id);

  if (sendVEmail) {
    res.type('application/json');
    return res.status(201).json('Email Sent');
  }

  if (!sendVEmail) {
    res.type('application/json');
    return res.status(200).json('Email Not Sent');
  }
};

const verificationGetEmail = async (req, res) => {
  const { id, token } = req.query;

  const tokenFind = await userUtility.getUserToken(id);

  if (tokenFind === token) {
    const key = 'isConfirmed';
    const val = 1;
    const updateVerified = await userUtility.updateUser(id, key, val);
    if (updateVerified) {
      res.redirect(config.baseUrl);
    }
  }

  if (!tokenFind) {
    res.redirect(config.baseUrl);
  }

  return null;
};

const senderVerificationGetEmail = async (req, res) => {
  const { id, token } = req.query;

  const tokenFind = await sendersUtility.getSendersToken(id);

  if (tokenFind === token) {
    const key = 'isConfirmed';
    const val = 1;
    const updateVerified = await sendersUtility.updateSender(id, key, val);

    if (updateVerified) {
      res.redirect(config.baseUrl);
    }
  }

  if (!tokenFind) {
    res.redirect(config.baseUrl);
  }

  return null;
};

module.exports = {
  mailGET,
  mailPOST,
  singleMailGET,
  mailByRecepient,
  mailByClient,
  verificationLinkEmail,
  verificationGetEmail,
  senderVerificationGetEmail,
};
