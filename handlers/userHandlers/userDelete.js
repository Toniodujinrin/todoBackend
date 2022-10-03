const _data = require("../../lib/data");
const validate = require("../tokenHandlers/tokenValidate");
//required data:email
const Delete = async (data, callback) => {
  const headers = data.headers;
  const userData = data.query;
  const token =
    typeof headers.token == "string" && headers.token.trim().length === 20
      ? headers.token
      : false;

  const email =
    typeof userData.email == "string" && userData.email.trim().length > 0
      ? userData.email
      : false;
  if (email) {
    try {
      validate(token, email, async (valid) => {
        if (valid) {
          try {
            await _data.delete("users", email);
            callback(200, { message: "user successfuly deleted" });
          } catch (error) {
            callback(500, { error: error });
          }
        } else {
          callback(403, { error: "you are not permited to delete this data" });
        }
      });
    } catch (error) {
      callback(500, {
        error:
          "error occured when trying to delete the user, maybe the user has already been deleted",
      });
    }
  } else {
    callback(400, { error: "data provided is either incorrect of incomplete" });
  }
};

module.exports = Delete;
