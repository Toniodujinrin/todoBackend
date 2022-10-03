const _data = require("../../lib/data");

const Delete = async (data, callback) => {
  const query = data.query;
  const tokenId =
    typeof query.tokenId == "string" && query.tokenId.trim().length === 20
      ? query.tokenId
      : false;
  if (tokenId) {
    try {
      //check if the tokenId exists in the database
      const data = await _data.get("tokens", tokenId);
      if (data) {
        //delete the check from the db
        await _data.delete("tokens", tokenId);
        callback(200, { message: "token successfuly deleted" });
      } else {
        callback(404, { error: "token not found" });
      }
    } catch (error) {
      callback(500, {
        error: "an error occured when trying to delete the token",
      });
    }
  } else {
    callback(400, {
      error: "the daata provided is wither invalid or incomplete ",
    });
  }
};

module.exports = Delete;
