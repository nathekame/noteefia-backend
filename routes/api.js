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

// const sendersRoute = require('./sendersRoute');

const clientsRoute = require('./clientsRoute');

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

  // console.log('THE TYPEOF HEADERS ==> ' + JSON.stringify(req.headers));
  // console.log('THE TYPEOF HEADERS ==> ' + JSON.stringify(req.headers.apikey));

  // const { sender } = req.body;

  // console.log('THE TYPEOF ==> ' + typeof apikey);

  if (typeof apikey !== 'undefined') {
    const keyCheck = (dbKey, reqKey) => {
      if (dbKey === reqKey) {
        return true;
      }
      return false;
    };

    const getDKey = await keysUtility.getKeyWithKey(apikey);

    // console.log(`THIS SIS THE KEY LOG => ${JSON.stringify(getDKey)}`);

    if (getDKey) {
      const status = Number(getDKey.status);

      console.log('IM HERE NOW ');

      if (status === 0) {
        res.type('application/json');
        return res
          .status(200)
          .json(
            'Sorry This Client Has Been Deactivated, Please Contact Support '
          );
      }

      // const checkSender = await sendersUtility.getSenderWITHEMAIL(sender);

      // const confirmed = Number(checkSender.isConfirmed);
      // const blocked = Number(checkSender.isBlocked);

      // if (!checkSender) {
      //   res.type('application/json');
      //   return res.status(200).json('Sorry Sender Email Address Was Not Found');
      // }

      // if (confirmed === 0) {
      //   res.type('application/json');
      //   return res.status(200).json('Sorry Sender Email Has Not Been Verified');
      // }

      // if (blocked === 1) {
      //   res.type('application/json');
      //   return res
      //     .status(200)
      //     .json('Sorry This Email Has Been Blocked, Please Contact Support ');
      // }

      // if (checkSender) {
      // const { clientID } = checkSender;

      // if (getDKey.clientID === clientID) {
      const dbKey = getDKey.key;

      // console.log('the whole dKkey ==> ' + JSON.stringify(dbKey));

      const reqUrl = `${req.protocol}://${req.get('host')}`;

      if (keyCheck(dbKey, apikey)) {
        // console.log('IM HERE TOO ==');
        res.locals.clientID = getDKey.clientID;
        res.locals.dhost = reqUrl;
        next();
      }

      if (!keyCheck(dbKey, apikey)) {
        console.log('error 1');
        res.sendStatus(403);
      }
      // } else {
      //   console.log('error 2');

      //   res.sendStatus(403);
      // }
      // }
    } else {
      console.log('error 3');

      res.sendStatus(403);
    }
  } else {
    console.log('error 4');

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

router.get('/sender_verification_email', emailRoute.senderVerificationGetEmail);

router.post('/verification_link', emailRoute.verificationLinkEmail);

router.get('/profile', isAuthenticated, profileRoute.profileGET);

router.get('/profile/:id', isAuthenticated, profileRoute.profileGETWITHID);

router.post('/profile', isAuthenticated, profileRoute.profilePOST);

const profileImageUpload = uploadFile.fields([{ name: 'profileImage' }]);
router.post('/fileupload/:name', profileImageUpload, fileRoute.filePOST);

// router.post('/key-generate', isAuthenticated, keysRoute.keyGENERATE);

router.post(
  '/key-generate/:clientID',
  isAuthenticated,
  keysRoute.keyGENERATEFORCLIENT
);

router.post('/key-regenerate', isAuthenticated, keysRoute.keyREGENERATE);

router.get('/keys', isAuthenticated, keysRoute.keysGET);

router.get('/keys/:clientID', isAuthenticated, keysRoute.keysGETWITHCLIENTID);

// router.post('/sender', isAuthenticated, sendersRoute.sendersPOST);

// router.get('/senders', isAuthenticated, sendersRoute.sendersGET);

// router.get(
//   '/senders/:clientID',
//   isAuthenticated,
//   sendersRoute.sendersGETWITHCLIENTID
// );

// router.post('/sender', sendersRoute.sendersPOST);

router.post('/client', isAuthenticated, clientsRoute.clientsPOST);

router.get('/clients', isAuthenticated, clientsRoute.clientsGET);

router.get(
  '/clients/:clientID',
  isAuthenticated,
  clientsRoute.clientsGETWITHID
);

router.get('/emails', isAuthenticated, emailRoute.mailGET);

// router.post('/frontend-email', isAuthenticated, emailRoute.mailPOST);

// router.post('/frontend-email', isAuthenticated, emailRoute.awsmailPOST);

// router.post('/email', isKeyValid, emailRoute.mailPOST);

router.post('/email', isKeyValid, emailRoute.awsmailPOST);

// router.get('/email/:id', isAuthenticated, emailRoute.singleMailGET);

// router.get('/email/client/:name', isAuthenticated, emailRoute.mailByClient);

// router.get(
//   '/email/recepient/:email',
//   isAuthenticated,
//   emailRoute.mailByRecepient
// );

// router.post('/sms', isAuthenticated, smsRoute.smsPOST);

// router.get('/sms', isAuthenticated, smsRoute.smsGET);

// router.get('/sms/:id', isAuthenticated, smsRoute.singleSmsGET);

// router.get('/sms/client/:name', isAuthenticated, smsRoute.smsByClient);

// router.get('/sms/recepient/:number', isAuthenticated, smsRoute.smsByRecepient);

module.exports = router;
