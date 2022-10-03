const _data = require("../../lib/data");

const Validate = async (token, email, callback) => {
  //validate the data passed
  const tokenId =
    typeof token == "string" && token.trim().length === 20 ? token : false;
  const userEmail =
    typeof email == "string" && email.trim().length !== 0 ? email : false;
  if (tokenId && userEmail) {
    //check if the token exists in the database
    try {
      const data = await _data.get("tokens", tokenId);
      if (data) {
        //check if the token has expired and check if the userEmail stored in the token matches the user email passed as an argument
        if (data.expires >= Date.now() && data.userEmail == userEmail) {
          callback(true);
        } else {
          callback(false);
        }
      }
    } catch (error) {
      callback(false);
    }
  } else callback(false);
};

module.exports = Validate;
