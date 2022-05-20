const clientsUtility = require('../utility/clientsUtility');

const clientsGET = async (req, res) => {
  const getClients = await clientsUtility.getAllClients();

  if (getClients) {
    res.type('application/json');
    return res.status(201).json(getClients);
  }

  return true;
};

const clientsPOST = async (req, res) => {
  const { name, url } = req.body;

  const data = {
    name,
    url,
    isBlocked: 0,
  };

  const createClient = await clientsUtility.createClient(data);

  if (createClient) {
    res.type('application/json');
    return res.status(201).json('Client Created');
  }

  res.type('application/json');
  return res.status(200).json('An Error Occurred');
};

const clientsGETWITHID = async (req, res) => {
  const { clientID } = req.params;

  const getClients = await clientsUtility.getClientWITHID(clientID);

  if (getClients) {
    res.type('application/json');
    return res.status(201).json(getClients);
  }

  return true;
};

module.exports = {
  clientsGET,
  clientsPOST,
  clientsGETWITHID,
};
