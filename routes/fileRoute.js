const metaUtility = require('../utility/usermetaUtility');

const filePOST = async (req, res) => {
  const { uid, key } = req.body;

  const postedFile = req.files[key][0];

  if (req.fileValidationError) {
    res.type('application/json');
    return res
      .status(500)
      .json('Invalid Image Format, Please Upload JPG or JPEG File(s) Only');
  }

  const checkMediaPath = async (path) => {
    if (path !== undefined) {
      const pathToSlice = path.path;

      // const fileUrl = pathToSlice.slice(34);
      // const fileUrl = pathToSlice.slice(48);
      const fileUrl = pathToSlice.slice(45);


      return fileUrl;
    }
    return null;
  };

  const uploadedFilePath = await checkMediaPath(postedFile);

  const upd = await metaUtility.createMeta(uid, key, uploadedFilePath);

  if (upd) {
    return res.status(201).json(upd);
  }

  return true;
};

module.exports = {
  filePOST,
};
