const _data = require("../../lib/data");
const helpers = require("../../helpers");

const put = async (data, callback) => {
  //required data = email
  //optional data : firstName, lastName , password
  const userData = data.payload;
  const firstName =
    typeof userData.firstName == "string" &&
    userData.firstName.trim().length > 0
      ? userData.firstName.trim()
      : false;
  const lastName =
    typeof userData.lastName == "string" && userData.lastName.trim().length > 0
      ? userData.lastName.trim()
      : false;
  const password =
    typeof userData.password == "string" && userData.password.trim().length > 0
      ? userData.password.trim()
      : falsse;
  const email =
    typeof userData.email == "string" && userData.email.trim().length > 0
      ? userData.email.trim()
      : false;
  if (email && (firstName || lastName || password)) {
    try {
      const data = await _data.get("users", email);
      if (firstName) data.firstName = firstName;
      if (lastName) data.lastName = lastName;
      if (password) data.password = helpers.hash(password);
      await _data.put("users", email, data);
      callback(200, { message: "user has been successfuly updated" });
    } catch (error) {
      callback(500, {
        error:
          "an error occured when trying to update data, the email passed may not belong to a valid user",
        error,
      });
    }
  } else {
    callback(400, { error: "data passed is either incorrect or incomplete" });
  }
};

module.exports = put;
