const _data = require("../../lib/data");
const validate = require("../tokenHandlers/tokenValidate");

//required data = email
const get = async (data, callback) => {
  const userData = data.query;
  const headers = data.headers;
  // validate the data sent from the browser
  const email =
    typeof userData.email == "string" && userData.email.trim().length > 0
      ? userData.email
      : false;
  const token =
    typeof headers.token == "string" && headers.token.trim().length == 20
      ? headers.token
      : false;
  if (email && token) {
    //check if the user exist if it does remove the hashed password and return the user object
    try {
      const data = await _data.get("users", email);
      delete data.password;
      //check if the token is valid and it belongs to the user
      validate(token, email, (validity) => {
        if (validity) {
          callback(200, data);
        } else {
          callback(403, {
            error: "you are not allowed to view this users data",
          });
        }
      });
    } catch (error) {
      callback(500, {
        error:
          "error occuredd when trying to read the user data, the user mat not exist",
        error,
      });
    }
  } else {
    callback(400, {
      error: "the data passed in the query string is invalid",
    });
  }
};

module.exports = get;
