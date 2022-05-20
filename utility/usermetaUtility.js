const sequelize = require('../db/sequelize');

const getMeta = async (userID, metaKey) => {
  const metaAction = sequelize.Usermeta.findOne({
    where: {
      userID,
      key: metaKey,
    },
  })
    .then((meta) => {
      if (!meta) {
        return false;
      }

      if (meta) {
        const metaValue = meta.get();
        const metaV = metaValue.value;
        return metaV;
      }
      return meta;
    })
    .catch((err) => {
      throw err;
    });

  const meA = await metaAction;
  return meA;
};

const createMeta = async (userID, metaKey, metaValue) => {
  const data = {
    userID,
    key: metaKey,
    value: metaValue,
  };

  const nMeta = sequelize.Usermeta.create(data)
    .then((newMeta) => {
      if (!newMeta) {
        return false;
      }

      if (newMeta) {
        return true;
      }
      return newMeta;
    })
    .catch((err) => {
      throw err;
    });

  const output = await nMeta;
  return output;
};

const updateMeta = async (uID, metaKey, metaValue) => {
  const Udate = sequelize.Usermeta.update(
    {
      value: metaValue,
    },
    {
      where: {
        userID: uID,
        key: metaKey,
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

module.exports = {
  createMeta,
  getMeta,
  updateMeta,
};
