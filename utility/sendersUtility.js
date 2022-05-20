const sequelize = require('../db/sequelize');
const clientsUtility = require('./clientsUtility');

const getSender = async (userID, metaKey) => {
  const metaAction = sequelize.Senders.findOne({
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

const createSender = async (data) => {
  const nMeta = sequelize.Senders.create(data)
    .then((newSender) => {
      if (!newSender) {
        return false;
      }

      if (newSender) {
        return newSender;
      }
      return newSender;
    })
    .catch((err) => {
      throw err;
    });

  const output = await nMeta;
  return output;
};

const updateSender = async (id, key, value) => {
  const Udate = sequelize.Senders.update(
    {
      [key]: value,
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

const getSenderWITHEMAIL = async (email) => {
  const metaAction = sequelize.Senders.findOne({
    where: {
      email,
    },
  })
    .then((meta) => {
      if (!meta) {
        return false;
      }
      return meta;
    })
    .catch((err) => {
      throw err;
    });

  const meA = await metaAction;
  return meA;
};

const getSendersToken = async (id) => {
  const metaAction = sequelize.Senders.findOne({
    where: {
      id,
    },
  })
    .then((user) => {
      if (!user) {
        return false;
      }

      if (user) {
        const userDetails = user.get();
        return userDetails;
      }
      return user;
    })
    .catch((err) => {
      throw err;
    });

  const meA = await metaAction;

  const tok = meA.confirmationToken;
  return tok;
};

const getAllSenders = async () => {
  const { rows, count } = await sequelize.Senders.findAndCountAll()
    .then((senders) => {
      if (!senders) {
        return false;
      }
      return senders;
    })
    .catch((err) => {
      throw err;
    });

  const dSendrs = rows;

  let dRows;

  for (let i = 0; i < dSendrs.length; i++) {
    const element = dSendrs[i];

    const getClient = await clientsUtility.getClientWITHID(element.clientID);

    element.clientID = getClient;
  }

  const dSenders = {
    count,
    rows,
  };

  return dSenders;
};

const getSenderWITHCLIENTID = async (clientID) => {
  const { rows, count } = await sequelize.Senders.findAndCountAll({
    where: { clientID },
  })
    .then((Senders) => {
      if (!Senders) {
        return false;
      }
      return Senders;
    })
    .catch((err) => {
      throw err;
    });

  const dSenders = {
    count,
    rows,
  };

  return dSenders;
};

module.exports = {
  createSender,
  getSender,
  updateSender,
  getSenderWITHEMAIL,
  getSendersToken,
  getAllSenders,
  getSenderWITHCLIENTID,
};
