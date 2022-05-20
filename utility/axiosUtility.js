const axios = require('axios');

const postRequest = async (url, data, options) => {
  try {
    const postReq = await axios
      .post(url, data, options)
      .then((response) => response)
      .catch((error) => error);

    return postReq;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

module.exports = {
  postRequest,
};
