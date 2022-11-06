const { da } = require("date-fns/locale");
const helpers = require("../../helpers");
const _data = require("../../lib/data");
const validate = require("../tokenHandlers/tokenValidate");

const put = async (data, callback) => {
  const headers = data.headers;
  const payload = data.payload;
  //validate fields
  const token =
    typeof headers.token == "string" && headers.token.length === 20
      ? headers.token
      : false;
  const details =
    typeof payload.details == "string" && payload.details.trim().length > 0
      ? payload.details
      : false;

  const taskId =
    typeof payload.taskId == "string" && payload.taskId.trim().length > 0
      ? payload.taskId
      : false;
  const due = typeof payload.due == "string" ? payload.due : false;
  const status = typeof payload.status == "string" ? payload.status : false;
  const completed =
    typeof payload.completed == "boolean" ? payload.completed : false;
  const shouldAlert =
    typeof payload.shouldAlert == "boolean" ? payload.shouldAlert : false;

  if (token && taskId && (details || due || status)) {
    //check if the task exists
    try {
      const data = await _data.get("tasks", taskId);

      if (data) {
        //authenticate the data
        validate(token, data.user, async (validity) => {
          if (validity) {
            if (details) data.details = details;
            if (due) data.due = due;
            data.completed = completed;
            if (status) data.status = status;
            if (shouldAlert) data.shouldAlert = shouldAlert;
            //upade the task and also update the task in the user object

            try {
              const res1 = await _data.put("tasks", taskId, data);
              //get the user data

              const res2 = await _data.get("users", data.user);

              let res3 = undefined;
              if (res2) {
                const newData = { ...res2 };
                const indexOfOldTask = newData.tasks.indexOf(
                  newData.tasks.find((task) => task._id == taskId)
                );

                newData.tasks.splice(indexOfOldTask, 1, data);

                res3 = await _data.put("users", data.user, newData);
              }
              if (res1 && res3 && res2) {
                callback(200, { message: "tasks successfuly updated" });
              } else {
                callback(500, { error: "failed to update the task" });
              }
            } catch (error) {
              callback(500, {
                error: `an error occured when trying to update the task, ${error}`,
              });
            }
          } else {
            callback(403, {
              error: "you are not authorized to access this data",
            });
          }
        });
      } else {
        callback(404, { error: "the task does not exist in the db" });
      }
    } catch (error) {
      callback(500, { error: "an error occured when trying to find the task" });
    }
  } else {
    callback(400, {
      error: "the data provided is either invalid or incomplete",
      error2: payload,
    });
  }
};

module.exports = put;
