const _data = require("../../lib/data");

//required data = email
const get = async (data, callback) => {
  const userData = data.query;
  // validate the data sent from the browser
  const email =
    typeof userData.email == "string" && userData.email.trim().length > 0
      ? userData.email
      : false;
  if (email) {
    //check if the user exist if it does remove the hashed password and return the user object
    try {
      const data = await _data.get("users", email);
      delete data.password;
      callback(200, data);
    } catch (error) {
      callback(500, {
        error:
          "error occuredd when trying to read the user data, the user mat not exist",
        error,
      });
    }
  } else {
    callback(400, { error: "the data passed in the query string is invalid" });
  }
};

module.exports = get;
