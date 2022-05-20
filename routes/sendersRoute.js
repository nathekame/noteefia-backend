const sendersUtility = require('../utility/sendersUtility');
const emailUtility = require('../utility/emailUtility');

const sendersGET = async (req, res) => {
  const getSenders = await sendersUtility.getAllSenders();

  if (getSenders) {
    res.type('application/json');
    return res.status(201).json(getSenders);
  }

  return true;
};

const sendersPOST = async (req, res) => {
  const { clientID, email } = req.body;

  const checkSenderEmail = await sendersUtility.getSenderWITHEMAIL(email);

  if (!checkSenderEmail) {
    const sendVEmail = await emailUtility.domainSenderVerificationEmail(
      clientID,
      email
    );

    if (sendVEmail) {
      res.type('application/json');
      return res.status(201).json('A verification link has been sent to the email address');
    }
    res.type('application/json');
    return res.status(200).json('An Error Occurred While Sending Verification Email');
  }
  res.type('application/json');
  return res.status(200).json('Email Already Exist');
};

const sendersGETWITHCLIENTID = async (req, res) => {
  const { clientID } = req.params;

  const getSenders = await sendersUtility.getSenderWITHCLIENTID(clientID);

  if (getSenders) {
    res.type('application/json');
    return res.status(201).json(getSenders);
  }

  return true;
};

module.exports = {
  sendersGET,
  sendersPOST,
  sendersGETWITHCLIENTID,
};
