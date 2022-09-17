//required data: email, password, firstName, lastName,
const _data = require("../../lib/data");
const helpers = require("../../helpers");

const post = async (data, callback) => {
  //validate fields coming from the browser
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
  if (firstName && lastName && password && email) {
    //check if the user already exists in the database if it doesnt create the user and same the primary key as the email
    try {
      const user = {};
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = helpers.hash(password);
      user.email = email;
      await _data.post("users", email, user);
      callback(200, { message: "user created successfuly" });
    } catch (error) {
      callback(500, {
        error:
          "An error occured when creating the user. the user may already exist",
      });
    }
  } else {
    callback(400, {
      error: "fields passed are either incorrect or incomplete",
    });
  }
};

module.exports = post;
