const _data = require("../../lib/data");
const validate = require("../tokenHandlers/tokenValidate");

const get = async (data, callback) => {
  const query = data.query;
  const headers = data.headers;

  const taskId =
    typeof query.task == "string" && query.task.trim().length > 0
      ? query.task
      : false;
  const token =
    typeof headers.token == "string" && headers.token.length === 20
      ? headers.token
      : false;

  if (token && taskId) {
    //check if the task exists in the database
    try {
      const data = await _data.get("tasks", taskId);
      if (data) {
        //check if the user is authorized to view the data by validating the token
        validate(token, data.user, async (validity) => {
          if (validity) {
            callback(200, data);
          } else {
            callback(403, {
              error: "you are not authorized to view this data",
            });
          }
        });
      } else {
        callback(404, { error: "user does not exist in the database" });
      }
    } catch (error) {
      callback(500, {
        error: "an error occured when trying to look up the user ",
      });
    }
  } else {
    callback(400, {
      error: "error passed in tokens is either incomplete or invalid",
    });
  }
};

module.exports = get;
