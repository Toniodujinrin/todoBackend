const _data = require("../../lib/data");

//required data: tokenId
const get = async (data, callback) => {
  const query = data.query;
  const tokenId =
    typeof query.tokenId == "string" && query.tokenId.trim().length > 0
      ? query.tokenId
      : false;
  if (tokenId) {
    try {
      try {
        const data = await _data.get("tokens", tokenId);
        if (data) {
          callback(200, data);
        } else {
          callback(404, { error: "could not find a token with that id" });
        }
      } catch (error) {
        callback(500, { error: error });
      }
    } catch (error) {
      callback(500, { error: "an error occured when reading the token" });
    }
  } else {
    callback(400, { error: "data passed is incorrect or incomplete" });
  }
};

module.exports = get;
