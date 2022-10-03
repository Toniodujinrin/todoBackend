const _data = require("../../lib/data");

//required data: tokenId
const put = async (data, callback) => {
  const query = data.query;
  const tokenId =
    typeof query.tokenId == "string" && query.tokenId.trim().length == 20
      ? query.tokenId
      : false;
  if (tokenId) {
    //check if the token actually exists in the db
    try {
      const data = await _data.get("tokens", tokenId);
      if (data) {
        if (data.expires >= Date.now()) {
          data.expires += 1000 * 60 * 60;
          _data.put("tokens", data.token, data);
          callback(200, { message: "token has been extended by an hour" });
        } else
          callback(403, {
            error: "the token has already expired you must create a new token",
          });
      } else {
        callback(404, { error: "the token does not exist" });
      }
    } catch (error) {
      callback(500, {
        error:
          "an error occured trying to update the token, the token may not exist",
      });
    }
  } else {
    callback(400, {
      error: "data provided is either incorrect or incomplete",
      query,
    });
  }
};

module.exports = put;
