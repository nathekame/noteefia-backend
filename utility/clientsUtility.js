const sequelize = require('../db/sequelize');

const getAllClients = async () => {
  const { rows, count } = await sequelize.Clients.findAndCountAll()
    .then((clients) => {
      if (!clients) {
        return false;
      }
      return clients;
    })
    .catch((err) => {
      throw err;
    });

  const clientss = {
    count,
    rows,
  };

  return clientss;
};

const getClientWITHID = async (cID) => {
  const getUsername = sequelize.Clients.findOne({ where: { id: cID } }).then(
    (user) => {
      if (user) {
        const userD = user.get();

        return userD;
      }
      return 'email not found';
    }
  );

  const checkedEmail = await getUsername;

  return checkedEmail;
};

const getClientByName = async (name) => {
  const getClientname = sequelize.Clients.findOne({ where: { name } }).then(
    (user) => {
      if (user) {
        const userD = user.get();

        return userD;
      }
      return 'client not found';
    }
  );

  const clientName = await getClientname;

  return clientName;
};

const createClient = async (data) => {
  const cClient = sequelize.Clients.create(data)
    .then((newClient) => {
      if (!newClient) {
        return false;
      }

      if (newClient) {
        const clientInfo = newClient.get();
        return clientInfo;
      }
      return newClient;
    })
    .catch((err) => {
      throw err;
    });

  const output = await cClient;
  return output;
};

const updateClient = async (id, col, val) => {
  const Udate = sequelize.Clients.update(
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

module.exports = {
  getAllClients,
  getClientWITHID,
  getClientByName,
  createClient,
  updateClient,
};
