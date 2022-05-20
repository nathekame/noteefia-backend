const sequelize = require('../db/sequelize');
const config = require('../config/secret');

const jwtDecode = async (req, res, tok) => {
  const decodedTok = {};

  if (tok === undefined) {
    return false;
  }
  jwt.verify(tok, config.jwtKey, (err, decoded) => {
    if (err) {
      throw err;
    }

    decodedTok.decoded = decoded;
  });
  return decodedTok;
};

const getURL = async (url) => {
  const metaAction = sequelize.Apikeys.findOne({
    where: {
      url,
    },
  })
    .then((foundUrl) => {
      if (!foundUrl) {
        return false;
      }
      return foundUrl;
    })
    .catch((err) => {
      throw err;
    });

  const meA = await metaAction;
  return meA;
};

const getKey = async (key) => {
  const metaAction = sequelize.Apikeys.findOne({
    where: {
      key,
    },
  })
    .then((foundKey) => {
      if (!foundKey) {
        return false;
      }

      return foundKey;
    })
    .catch((err) => {
      throw err;
    });

  const meA = await metaAction;
  return meA;
};

const getKeyWITHID = async (id) => {
  const metaAction = sequelize.Apikeys.findOne({
    where: {
      id,
    },
  })
    .then((foundKey) => {
      if (!foundKey) {
        return false;
      }

      return foundKey;
    })
    .catch((err) => {
      throw err;
    });

  const meA = await metaAction;
  return meA;
};

const createKey = async (data) => {
  const nMeta = sequelize.Apikeys.create(data)
    .then((newKey) => {
      if (!newKey) {
        return false;
      }

      if (newKey) {
        return true;
      }
      return newKey;
    })
    .catch((err) => {
      throw err;
    });

  const output = await nMeta;
  return output;
};

const getAllKeys = async () => {
  const { rows, count } = await sequelize.Apikeys.findAndCountAll()
    .then((keys) => {
      if (!keys) {
        return false;
      }
      return keys;
    })
    .catch((err) => {
      throw err;
    });

  const keyss = {
    count,
    rows,
  };

  return keyss;
};

const getKeysWITHUID = async (uid) => {
  const { rows, count } = await sequelize.Apikeys.findAndCountAll({
    where: { uid },
  })
    .then((Keys) => {
      if (!Keys) {
        return false;
      }
      return Keys;
    })
    .catch((err) => {
      throw err;
    });

  const dKeys = {
    count,
    rows,
  };

  return dKeys;
};

const updateKey = async (id, key, value, uid) => {
  const Udate = sequelize.Apikeys.update(
    {
      [key]: value,
      updatedBy: uid,
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

const getKeyWITHCLIENTID = async (clientID) => {
  const dKey = await sequelize.Apikeys.findOne({
    where: { clientID },
  })
    .then((Keys) => {
      if (!Keys) {
        return false;
      }
      return Keys;
    })
    .catch((err) => {
      throw err;
    });

  return dKey;
};

const getKeyWithKey = async (key) => {
  const dKey = await sequelize.Apikeys.findOne({
    where: { key },
  })
    .then((Keys) => {
      if (!Keys) {
        return false;
      }
      return Keys;
    })
    .catch((err) => {
      throw err;
    });

  return dKey;
};

module.exports = {
  jwtDecode,
  getURL,
  getKey,
  getKeyWITHID,
  createKey,
  getAllKeys,
  getKeysWITHUID,
  updateKey,
  getKeyWITHCLIENTID,
  getKeyWithKey
};
