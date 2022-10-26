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
    //check if the email exists

    try {
      //check if the email exist
      const data = await _data.get("users", email);
      if (data) {
        validate(token, email, async (valid) => {
          if (valid) {
            try {
              //delete all checks  related to the user

              if (data.tasks) {
                data.tasks.forEach(async (item) => {
                  await _data.delete("tasks", item._id);
                });
              }
              const res = await _data.delete("users", email);
              if (res) {
                callback(200, { message: "user successfuly deleted" });
              } else {
                callback(500, { message: "user could not be deleted" });
              }
            } catch (error) {
              callback(500, { error: error });
            }
          } else {
            callback(403, {
              error: "you are not permited to delete this data",
            });
          }
        });
      } else {
        callback(404, { error: "user does not exist" });
      }
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
