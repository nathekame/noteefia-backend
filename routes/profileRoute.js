const metaUtility = require('../utility/usermetaUtility');
const userUtility = require('../utility/userUtility');

const profileGET = async (req, res, next) => res.status(200);

const profileGETWITHID = async (req, res, next) => {
  const uID = req.params.id;

  const profileObj = {};

  profileObj.isProfileComplete = await metaUtility.getMeta(
    uID,
    'isProfileComplete'
  );
  profileObj.email = await userUtility.getUserEmail(uID);
  profileObj.role = await metaUtility.getMeta(uID, 'role');

  profileObj.firstName = await metaUtility.getMeta(uID, 'firstName');
  profileObj.lastName = await metaUtility.getMeta(uID, 'lastName');
  profileObj.gender = await metaUtility.getMeta(uID, 'gender');

  profileObj.mobileNumber = await metaUtility.getMeta(uID, 'mobileNumber');

  profileObj.profilePic = await metaUtility.getMeta(uID, 'profileImage');

  res.type('application/json');
  return res.status(201).json(profileObj);
};

const profilePOST = async (req, res) => {
  const profileObj = req.body;

  const { uid } = profileObj;

  const reqEntries = Object.entries(profileObj);

  for (const [key, value] of reqEntries) {
    if (key !== 'uid' && key !== 'profileImage') {
      if (key === 'isProfileComplete') {
        const upd = await metaUtility.updateMeta(uid, key, value);
        if (upd === false) {
          res.json('error');
          break;
        }
      } else if (value !== '') {
        const upd = await metaUtility.createMeta(uid, key, value);
        if (upd === false) {
          res.json('error');
          break;
        }
      }
      
    }

  }

  res.type('application/json');
  return res.status(201).json('success');
};

module.exports = {
  profileGET,
  profilePOST,
  profileGETWITHID,
};
