const _data = require("../../lib/data");
const validate = require("../tokenHandlers/tokenValidate");

const Delete = async (data, callback) => {
  const headers = data.headers;
  const query = data.query;

  const taskId =
    typeof query.task == "string" && query.task.trim().length > 0
      ? query.task.trim()
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
            try {
              await _data.delete("tasks", taskId);
              //update the task array in the user object
              const userData = await _data.get("users", data.user);
              if (userData) {
                //get the index of the task
                const index = userData.tasks.indexOf(
                  userData.tasks.find((task) => task._id == taskId)
                );
                userData.tasks.splice(index, 1);
                //update user
                try {
                  await _data.put("users", data.user, userData);
                  callback(200, { message: "task successfuly deleted" });
                } catch (error) {
                  callback(500, {
                    error:
                      "an error occured when tring to remove the task from the user object",
                  });
                }
              } else {
                callback(404, {
                  error: "could not find the user who initiated the check",
                });
              }
            } catch (error) {
              callback(500, {
                error: "an error occured when trying to delete the task",
              });
            }
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
        error: "an error occured when trying to find the task ",
        taskId,
      });
    }
  } else {
    callback(400, {
      error: "error passed in tokens is either incomplete or invalid",
    });
  }
};

module.exports = Delete;
