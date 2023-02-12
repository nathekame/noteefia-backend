const bcrypt = require('bcryptjs');
const keysUtility = require('../utility/keysUtility');

const keyzGen = async () => {
  const alpha = 'abcdefghABCDEFGHIJKLijklmnopqrstuvwxyzMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*_+';

  const chars = alpha + numbers + symbols;

  let apiKey = '';

  for (let i = 0; i < 43; i++) {
    apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return apiKey;
};

const keyGENERATEFORCLIENT = async (req, res) => {
  const { clientID } = req.body;

  const pss = await keyzGen();
  const dKey = `NS.${pss}`;

  const checkKey = await keysUtility.getKey(dKey);

  if (!checkKey) {
    const data = {
      clientID,
      key: dKey,
      status: 1,
    };

    const addKeyToDB = await keysUtility.createKey(data);

    if (addKeyToDB) {
      res.type('application/json');
      return res.status(201).json(dKey);
    }
  }
};

const keyREGENERATE = async (req, res) => {
  const { uid, kid } = req.body;

  const generateKeyHash = (ky) => bcrypt.hashSync(ky, bcrypt.genSaltSync(8), null);

  const pss = await keyzGen();
  const dKey = `NS.${pss}`;
  const keyHash = generateKeyHash(dKey);

  const checkKey = await keysUtility.getKey(keyHash);

  if (!checkKey) {
    const key = 'key';
    const value = keyHash;
    const id = kid;

    const updateKey = await keysUtility.updateKey(id, key, value, uid);

    if (updateKey) {
      res.type('application/json');
      return res.status(201).json(dKey);
    }
  }
};

const keysGET = async (req, res) => {
  const getKeys = await keysUtility.getAllKeys();

  if (getKeys) {
    res.type('application/json');
    return res.status(201).json(getKeys);
  }

  return true;
};

const keysGETWITHCLIENTID = async (req, res) => {
  const { clientID } = req.params;

  const getKey = await keysUtility.getKeyWITHCLIENTID(clientID);

  if (getKey) {
    res.type('application/json');
    return res.status(201).json(getKey.key);
  }

  res.type('application/json');
  return res.status(200).json('No Key');
};

module.exports = {
  keyGENERATEFORCLIENT,
  keyREGENERATE,
  keysGET,
  keysGETWITHCLIENTID,
};
