const sequelize = require('../db/sequelize');

const getUser = async (userID) => {
  const metaAction = sequelize.User.findOne({
    where: {
      id: userID,
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
  return meA;
};

const getUserToken = async (userID) => {
  const metaAction = sequelize.User.findOne({
    where: {
      id: userID,
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


const checkEmail = async (email) => {
  const metaAction = sequelize.User.findOne({
    where: {
      email,
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
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });

  const meA = await metaAction;
  return meA;
};

const createUser = async (email, password, val) => {
  const data = {
    email,
    password,
    isVerified: val,
  };

  const cUser = sequelize.User.create(data)
    .then((newUser) => {
      if (!newUser) {
        return false;
      }

      if (newUser) {
        const userInfo = newUser.get();
        return userInfo;
      }
      return newUser;
    })
    .catch((err) => {
      throw err;
    });

  const output = await cUser;
  return output;
};

const updateUser = async (id, key, val) => {
  const Udate = sequelize.User.update(
    {
      [key]: val,
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

const getAllUsers = async () => {
  const { count, rows } = await sequelize.User.findAndCountAll()
    .then((findCans) => {
      if (!findCans) {
        return false;
      }

      if (findCans) {
        return findCans;
      }
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });

  const dDetails = {
    users: rows,
    userCount: count,
  };

  return dDetails;
};

const getUserEmail = async (uid) => {
  const metaAction = sequelize.User.findOne({
    where: {
      id: uid,
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

  return meA.email;
};

module.exports = {
  getUser,
  getUserToken,
  checkEmail,
  createUser,
  updateUser,
  getAllUsers,
  getUserEmail,
};
