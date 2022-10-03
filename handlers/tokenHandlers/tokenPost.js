const helpers = require("../../helpers");
const _data = require("../../lib/data");

const post = async (data, callback) => {
  const payload = data.payload;
  const email =
    typeof payload.email == "string" && payload.email.trim().length > 0
      ? payload.email
      : false;
  const password =
    typeof payload.password == "string" && payload.password.trim().length > 0
      ? payload.password
      : false;
  if (email && password) {
    //check if the email belongs to an existing user then check if the password provided matches the password in the users object
    try {
      const data = await _data.get("users", email);
      const hashedPassword = helpers.hash(password);
      if (data) {
        if (data.password == hashedPassword) {
          //create the token object
          const tokenObject = {};
          tokenObject.token = helpers.createRandomString(20);
          tokenObject.expires = Date.now() + 1000 * 60 * 60 * 24;
          tokenObject.userEmail = email;
          //save the token object
          await _data.post("tokens", tokenObject.token, tokenObject);
          callback(200, tokenObject);
        } else {
          callback(403, {
            error:
              "the password you entered does not match the password of the user",
          });
        }
      } else {
        callback(404, {
          error:
            "the email passed does not belong to an existing user or the password passed is incorrect",
        });
      }
    } catch (error) {
      callback(500, { error: error });
    }
  } else {
    callback(400, {
      error: "the data passed is either incorrect or incomplete",
    });
  }
};

module.exports = post;

//required data email and password
