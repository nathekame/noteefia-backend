const express = require('express');
const jwt = require('jsonwebtoken');

const path = require('path');

const multer = require('multer');

const router = express.Router();

const authRoute = require('./authRoute');
const passwordRoute = require('./passwordRoute');
const profileRoute = require('./profileRoute');
const emailRoute = require('./emailRoute');

const fileRoute = require('./fileRoute');
const keysUtility = require('../utility/keysUtility');

const keysRoute = require('./keysRoute');

const clientsRoute = require('./clientsRoute');

const smsRoute = require('./smsRoute');

const imageRoute = require('./imageRoute');

const config = require('../config/secret');

const isAuthenticated = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');

    const bearerToken = bearer[1];

    jwt.verify(bearerToken, config.jwtKey, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      }

      if (decoded) {
        req.token = bearerToken;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

const isKeyValid = async (req, res, next) => {
  const { apikey } = req.headers;

  if (typeof apikey !== 'undefined') {
    const keyCheck = (dbKey, reqKey) => {
      if (dbKey === reqKey) {
        return true;
      }
      return false;
    };

    const getDKey = await keysUtility.getKeyWithKey(apikey);

    if (getDKey) {
      const status = Number(getDKey.status);

      if (status === 0) {
        res.type('application/json');
        return res
          .status(200)
          .json(
            'Sorry This Client Has Been Deactivated, Please Contact Support '
          );
      }

      const dbKey = getDKey.key;

      const reqUrl = `${req.protocol}://${req.get('host')}`;

      if (keyCheck(dbKey, apikey)) {
        res.locals.clientID = getDKey.clientID;
        res.locals.dhost = reqUrl;
        next();
      }

      if (!keyCheck(dbKey, apikey)) {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

const checkFileName = (name) => {
  if (name === 'profileImage') {
    const cs = path.join(__dirname, '../public/uploads/images');
    return cs;
  }

  return name;
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, checkFileName(file.fieldname));
  },
  filename: async (req, file, cb) => {
    const dName = file.fieldname;
    const ogName = file.originalname;
    const fName = `${dName}-${Date.now()}${path.extname(ogName)}`;
    cb(null, fName);
  },
  onError(err, next) {
    next(err);
  },
});

const singleFileFilter = async (req, file, cb) => {
  if (file.fieldname === 'profileImage') {
    if (
      file.mimetype === 'image/jpg'
      || file.mimetype === 'image/jpeg'
      || file.mimetype === 'image/png'
    ) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Forbidden Extension';
      return cb(null, false, req.fileValidationError);
    }
  } else {
    req.fileValidationError = 'Forbidden Extension';
    return cb(null, false, req.fileValidationError);
  }
};

const uploadFile = multer({
  storage,
  fileFilter: singleFileFilter,
});
// Configure multer storage settings
const strage = multer.memoryStorage();

// Create a multer instance with the configured storage settings
const upload = multer({ strage });

router.get('/', authRoute.homeGET);

router.post('/login', authRoute.loginPOST);

router.post('/register', authRoute.registerPOST);

router.post('/passwordresetlink', passwordRoute.passwordResetLinkPostRoute);

router.get('/passwordreset', passwordRoute.passwordResetGetRoute);

router.post('/passwordreset', passwordRoute.passwordResetPostRoute);

router.post(
  '/passwordupdate',
  isAuthenticated,
  passwordRoute.passwordUpdateRoute,
);

router.get('/verification_email', emailRoute.verificationGetEmail);

// router.get('/sender_verification_email', emailRoute.senderVerificationGetEmail);

router.post('/verification_link', emailRoute.verificationLinkEmail);

router.get('/profile', isAuthenticated, profileRoute.profileGET);

router.get('/profile/:id', isAuthenticated, profileRoute.profileGETWITHID);

router.post('/profile', isAuthenticated, profileRoute.profilePOST);

const profileImageUpload = uploadFile.fields([{ name: 'profileImage' }]);
router.post('/fileupload/:name', profileImageUpload, fileRoute.filePOST);

router.post(
  '/key-generate/:clientID',
  isAuthenticated,
  keysRoute.keyGENERATEFORCLIENT
);

router.post('/key-regenerate', isAuthenticated, keysRoute.keyREGENERATE);

router.get('/keys', isAuthenticated, keysRoute.keysGET);

router.get('/keys/:clientID', isAuthenticated, keysRoute.keysGETWITHCLIENTID);

router.post('/client', isAuthenticated, clientsRoute.clientsPOST);

router.get('/clients', isAuthenticated, clientsRoute.clientsGET);

router.get(
  '/clients/:clientID',
  isAuthenticated,
  clientsRoute.clientsGETWITHID
);

router.get('/emails', isAuthenticated, emailRoute.mailGET);

router.post('/email', isKeyValid, emailRoute.awsmailPOST);

// router.post('/sms', isAuthenticated, smsRoute.smsPOST);
router.post('/sms', isKeyValid, smsRoute.smsPOST);
// router.post('/sms', smsRoute.smsPOST);

router.get('/sms', isAuthenticated, smsRoute.smsGET);

router.post(
  '/facedetect',
  upload.single('proImage'),
  isAuthenticated,
  imageRoute.facePOST,
);

// router.get('/sms/:id', isAuthenticated, smsRoute.singleSmsGET);

// router.get('/sms/client/:name', isAuthenticated, smsRoute.smsByClient);

// router.get('/sms/recepient/:number', isAuthenticated, smsRoute.smsByRecepient);

module.exports = router;
