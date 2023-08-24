const clientsUtility = require('../utility/clientsUtility');
const imageUtility = require('../utility/imageUtility');

const clientsGET = async (req, res) => {
  const getClients = await clientsUtility.getAllClients();

  if (getClients) {
    res.type('application/json');
    return res.status(201).json(getClients);
  }

  return true;
};

const facePOST = async (req, res) => {
  //   const uploadedImage = req.files; // Use the appropriate field name

  if (!req.file) {
    // return res.status(400).json({ message: 'No file uploaded.' });
    return res.status(200).json({ message: 'No file uploaded.' });

  }
  //   const uploadedImage = req.files.image;

  //   console.log('THE UPLOADED IMAGE NAME ==> ' + JSON.stringify(uploadedImage));

  //   const imageBuffer = uploadedImage.data;

  const imageBuffer = req.file.buffer;

  //   console.log(`THE UPLOADED IMAGE NAME ==> ${JSON.stringify(imageBuffer)}`);

  // Define the parameters for the DetectFaces operation
  //   const params = {
  //     Image: {
  //       Bytes: imageBuffer,
  //     },
  //   };

  const faceDetectionParams = {
    Image: {
      Bytes: imageBuffer,
    },
    // Attributes: ['EMOTIONS'], // Change attributes as needed
  };

  const checkForFace = await imageUtility.detectFace(
    faceDetectionParams,
    imageBuffer
  );

  if (checkForFace) {
    // console.log('ITD S PORTRIAT');
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
  facePOST,
  clientsGETWITHID,
};
