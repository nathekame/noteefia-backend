const bcrypt = require('bcryptjs');
const sequelize = require('../db/sequelize');

const userUtility = require('../utility/userUtility');
const emailUtility = require('../utility/emailUtility');

const passwordUpdateRoute = async (req, res, next) => {
  const { uid, currentPassword, newPassword } = req.body;

  const userPassword = await userUtility.getUserPassword(uid);

  const currentUserPassword = userPassword;

  const isValidPassword = async (userpass, password) =>
    bcrypt.compareSync(password, userpass);

  const pCheck = await isValidPassword(currentUserPassword, currentPassword);

  const generateHash = async (pword) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pword, salt, null);
  };

  if (pCheck) {
    const newHashPassword = await generateHash(newPassword);

    sequelize.User.update(
      {
        password: newHashPassword,
      },
      {
        where: {
          id: uid,
        },
      }
    )
      .then((updatedPassword) => {
        if (!updatedPassword) {
          res.type('application/json');
          return res.status(200).json({
            status: 'error',
            body: 'Password not updated, please try again',
          });
        }

        if (updatedPassword) {
          res.type('application/json');
          return res
            .status(201)
            .json({ status: 'success', body: 'Password Updated Successfully' });
        }
      })
      .catch((err) => {
        next(err);
        req.flash('error', 'An error Occurred');
        res.redirect('/account');
      });
  } else if (!pCheck) {
    res.type('application/json');
    return res.status(200).json({
      status: 'error',
      body: 'Your current password doesnt match your exisiting password',
    });
  }
};

const passwordResetLinkPostRoute = async (req, res) => {
  const { email } = req.body;

  const emailCheck = await userUtility.checkEmail(email);

  if (emailCheck) {
    const uid = emailCheck.id;

    const sendResetEmail = await emailUtility.sendPasswordResetEmail(uid);

    if (sendResetEmail) {
      res.type('application/json');
      return res.status(201).json('Success');
    }
  } else {
    res.type('application/json');
    return res.status(200).json('error');
  }
};

const passwordResetGetRoute = async (req, res) => {
  const { id } = req.query;

  res.render('pages/passwordreset', { uid: id });
};

const passwordResetPostRoute = async (req, res, next) => {
  const { uid, newPword } = req.body;

  const generateHash = async (pword) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pword, salt, null);
  };

  const newHashPassword = await generateHash(newPword);

  const pUpdate = sequelize.User.update(
    {
      password: newHashPassword,
    },
    {
      where: {
        id: uid,
      },
    }
  )
    .then((updatedPassword) => {
      if (!updatedPassword) {
        res.type('application/json');
        return res.status(200).json('Failed');
      }

      if (updatedPassword) {
        return true;
      }
    })
    .catch((err) => {
      next(err);
    });

  const updateOutput = await pUpdate;
  if (updateOutput) {
    res.type('application/json');
    return res.status(201).json('Success');
  }
};

module.exports = {
  passwordUpdateRoute,
  passwordResetLinkPostRoute,
  passwordResetGetRoute,
  passwordResetPostRoute,
};
