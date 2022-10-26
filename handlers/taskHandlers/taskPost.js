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
  const due = typeof payload.due == "string" ? payload.due : false;
  const createdAt =
    typeof payload.createdAt == "number" ? payload.createdAt : false;
  const status =
    typeof payload.status == "string" && payload.status.length !== 0
      ? payload.status
      : false;

  const completed =
    typeof payload.completed == "boolean" ? payload.completed : false;
  const shouldAlert =
    typeof payload.shouldAlert == "boolean" ? payload.shouldAlert : false;
  if (email && details && createdAt && status && due) {
    const task = {};
    task._id = helpers.createRandomString(20);
    task.details = details;
    task.createdAt = createdAt;
    task.user = email;
    task.due = due;
    task.status = status;
    task.completed = completed;
    task.shouldAlert = shouldAlert;

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
              data.tasks.unshift(task);
              const res1 = await _data.put("users", email, data);
              const res2 = await _data.post("tasks", task._id, task);
              if (res1 && res2) {
                callback(200, { message: "task successfuly created" });
              } else {
                callback(500, { error: "could not update task objects" });
              }
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
