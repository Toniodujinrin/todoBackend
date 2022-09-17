const _data = require("../../lib/data");
//required data:email
const Delete = async (data, callback) => {
  const userData = data.query;
  const email =
    typeof userData.email == "string" && userData.email.trim().length > 0
      ? userData.email
      : false;
  if (email) {
    try {
      await _data.delete("users", email);
      callback(200, { message: "user successfuly deleted" });
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