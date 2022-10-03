const _data = require("../../lib/data");
const helpers = require("../../helpers");
const validate = require("../tokenHandlers/tokenValidate");

const post = async (data, callback) => {
  //required data: task details,user email,
  //optional data: completion time
  const payload = data.payload;
  const headers = data.headers;
  //validate the incoming data from the user
  const token =
    typeof headers.token == "string" && headers.token.length === 20
      ? headers.token
      : false;
  const details =
    typeof payload.details == "string" && payload.details.trim().length > 0
      ? payload.details
      : false;

  const email =
    typeof payload.email == "string" && payload.email.trim().length > 0
      ? payload.email
      : false;
  const completion =
    typeof payload.completion == "string" &&
    payload.completion.trim().length > 0
      ? payload.completion
      : false;
  if (email && details) {
    const task = {};
    task.id = helpers.createRandomString(20);
    task.details = details;
    task.createdAt = Date.now();
    task.user = email;
    if (completion) {
      completionString = completion.trim();
      const year = completionString.slice(0, 4);
      const month = completionString.slice(5, 7);
      const day = completionString.slice(8, 10);
      const hour = completionString.slice(11);
      const normalizedDate = `${day}/${month}/${year}, ${hour}`;
      task.completion = normalizedDate;
    }
    try {
      //check if the user with email provided exists in the database
      const data = await _data.get("users", email);
      if (data) {
        //check if the user is authorized to make the task by validating the token in the header
        validate(token, email, async (validity) => {
          if (validity) {
            try {
              // if there is no task object in the user profile create a task object
              if (!data.tasks) {
                data.tasks = [];
              }
              //push the new task to the begin of the tasks array
              data.tasks.unshift(task.id);
              await _data.put("users", email, data);
              //append the task object to the db

              await _data.post("tasks", task.id, task);
              callback(200, { message: "task successfuly created" });
            } catch (error) {
              callback(500, {
                error: "error occured when trying to create the tasks",
              });
            }
          } else {
            callback(403, {
              error: "you are not valid to make this task",
              email,
            });
          }
        });
      } else {
        callback(404, { error: "user with email provided does not exist" });
      }
    } catch (error) {
      callback(500, {
        error: "error occured while trying to check uset authenticity",
      });
    }
  } else {
    callback(400, { error: "data provided is either invalid or incomplete" });
  }
};

module.exports = post;
