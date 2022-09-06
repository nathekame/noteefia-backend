/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../db/sequelize');
const config = require('../config/secret');

const metaUtility = require('../utility/usermetaUtility');
const emailUtility = require('../utility/emailUtility');

const homeGET = async (req, res) => {
  const obj = { data: true };
  res.type('application/json');
  return res.status(201).json(obj);
};

const loginPOST = async (req, res) => {
  const { email, password } = req.body;

  const isValidPassword = (userpass, mpassword) => bcrypt.compareSync(mpassword, userpass);

  const loginUser = await sequelize.User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (!user) {
        return false;
      }

      if (!isValidPassword(user.password, password)) {
        return false;
      }

      if (isValidPassword(user.password, password)) {
        const userinfo = user.get();

        return userinfo;
      }
    })
    .catch((err) => false);

  const waitOutput = loginUser;

  if (!waitOutput) {
    res.type('application/json');
    return res.status(200).json({ msg: 'Password Mismatch' });
  }

  if (waitOutput) {
    const uid = waitOutput.id;

    const metaKey = 'isProfileComplete';

    const roleKey = 'role';

    const metaOutput = await metaUtility.getMeta(uid, metaKey);

    const roleMetaOutput = await metaUtility.getMeta(uid, roleKey);

    waitOutput.isProfileComplete = metaOutput;
    waitOutput.role = roleMetaOutput;

    waitOutput.firstName = await metaUtility.getMeta(uid, 'firstName');
    waitOutput.lastName = await metaUtility.getMeta(uid, 'lastName');
    waitOutput.profilePic = await metaUtility.getMeta(uid, 'profileImage');

    const awaitingOutObj = {
      userID: uid,
      role: roleMetaOutput,
      isProfileComplete: metaOutput,
    };

    const token = jwt.sign(awaitingOutObj, config.jwtKey);

    waitOutput.jwtoken = token;

    res.type('application/json');
    return res.status(201).json(waitOutput);
  }
};

const registerPOST = async (req, res, next) => {
  const { email } = req.body;
  const pword = req.body.password;
  const role = 'user';

  const generateHash = function (pwrd) {
    return bcrypt.hashSync(pwrd, bcrypt.genSaltSync(8), null);
  };

  const dataEntry = sequelize.User.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        res.type('application/json');
        return res.status(200).json({ msg: 'Email Already Taken' });
      }

      const userPassword = generateHash(pword);

      const data = {
        email,
        password: userPassword,
        isConfirmed: 0,
        isBlocked: 0,
      };

      const createU = sequelize.User.create(data)
        .then((newUser) => {
          if (!newUser) {
            res.type('application/json');
            return res.status(200).json({ msg: 'Error Creating User' });
          }

          if (newUser) {
            return newUser;
          }
        })
        .catch((err) => {
          next(err);
        });

      return createU;
    })
    .catch((err) => {
      next(err);
    });

  const awaitingOut = await dataEntry;

  const uID = awaitingOut.id;
  const key = 'role';
  const value = role;

  const pMeta = await metaUtility.createMeta(uID, key, value);

  const profileKey = 'isProfileComplete';
  const profileValue = '0';
  const profileMeta = await metaUtility.createMeta(
    uID,
    profileKey,
    profileValue
  );

  awaitingOut.role = pMeta;
  awaitingOut.isProfileComplete = profileMeta;

  const funcsArray = [];

  if (pMeta !== undefined) {
    funcsArray.push(pMeta);
  }

  if (profileMeta !== undefined) {
    funcsArray.push(profileMeta);
  }

  const outcome = await Promise.allSettled(funcsArray)
    .then((values) => {
      for (let i = 0; i < values.length; i++) {
        const element = values[i];
        if (element.status === 'fulfilled') {
          return true;
        }
        if (element.status === 'rejected') {
          return false;
        }
      }
    })
    .catch((error) => {
      next(error);
    });

  if (outcome) {
    const sendVEmail = await emailUtility.sendVerificationEmail(uID);

    // console.log('the output of the email ent ===>> ' + JSON.stringify(sendVEmail));

    if (!sendVEmail.isErr) {
      res.type('application/json');
      return res.status(201).json('Account Created Successfully');
    }

    if (sendVEmail.isErr) {
      res.type('application/json');
      return res.status(504).json('An Error Occurred');
    }
  }

  const awaitingOutObj = {
    userID: awaitingOut.id,
    role: pMeta,
    isProfileComplete: 0,
  };

  const token = jwt.sign(awaitingOutObj, config.jwtKey);

  const toReturn = {
    userToken: token,
  };

  res.type('application/json');
  return res.status(201).json(toReturn);
};

module.exports = {
  homeGET,
  loginPOST,
  registerPOST,
};
