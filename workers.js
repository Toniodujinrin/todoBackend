const _data = require("./lib/data");
const { format } = require("date-fns");
const helpers = require("./helpers");
const util = require("util");
const debug = util.debuglog("workers");

const workers = {};

workers.gatherTasks = async () => {
  try {
    const data = await _data.listAll("tasks");

    //sanity check the tasks to make sure that they meet all the requirements
    if (data && data.length > 0) {
      data.forEach(async (task) => {
        //get the task pbject from the taskObjects
        try {
          const taskObject = await _data.get("tasks", task);
          if (taskObject) {
            const originalTask = taskObject;
            workers.sanityCheckTask(originalTask);
          } else {
            debug("no task object was returned maybe it has been deleted");
          }
        } catch (error) {
          debug(error);
        }
      });
    } else {
      debug("there are no tasks to check ");
    }
  } catch (error) {
    debug("there are no tasks to check");
  }
};

workers.sanityCheckTask = (Task) => {
  const originalTask =
    typeof Task == "object" && Object.keys(Task) !== 0 ? Task : false;
  originalTask.status =
    typeof originalTask.status == "string" ? originalTask.status : false;
  originalTask.details =
    typeof originalTask.details == "string" ? originalTask.details : false;
  originalTask.completed =
    typeof originalTask.completed == "boolean" ? originalTask.completed : false;
  originalTask.user =
    typeof originalTask.user == "string" &&
    originalTask.user.trim().length !== 0
      ? originalTask.user
      : false;
  originalTask._id =
    typeof originalTask._id == "string" && originalTask._id.trim().length !== 0
      ? originalTask._id
      : false;
  originalTask.due =
    typeof originalTask.due == "string" ? originalTask.due : false;
  originalTask.shouldAlert =
    typeof originalTask.shouldAlert == "boolean"
      ? originalTask.shouldAlert
      : false;

  if (
    originalTask &&
    originalTask.status &&
    originalTask.details &&
    originalTask.user &&
    originalTask._id &&
    originalTask.due
  ) {
    workers.scanForDue(originalTask);
  } else {
    debug("task is not valid skipping it ");
  }
};

workers.scanForDue = (originalTask) => {
  /*determine the checks that should be alerted
  criteria for being alerted 
  1)the task most not be completed 
  2)the task most have reached its due date 
  3)the task most be cleared to be alerted 
  

  */
  const isNotCompleted = !originalTask.completed;
  const isDue =
    originalTask.due.trim() == format(new Date(Date.now()), "yyyy-MM-dd");

  const shouldAlert = originalTask.shouldAlert;

  if (isNotCompleted && isDue && shouldAlert) {
    workers.alertUserAndUpdateTask(originalTask);
  } else {
    debug("the task is not due no need to alert");
  }
};

workers.alertUserAndUpdateTask = (originalTask) => {
  //alert the user and update the check
  if (!originalTask.alerted) {
    const userEmail = originalTask.user;
    const message = `your task with details:${originalTask.details} is due `;
    helpers.sendNodeMailer(userEmail, message);
    originalTask.alerted = true;
    _data.put("tasks", originalTask._id, originalTask);
  }
};
workers.loop = () => {
  setInterval(() => {
    workers.gatherTasks();
  }, 1000 * 60 * 5);
};

workers.init = () => {
  workers.loop();
  workers.gatherTasks();
  console.log("\x1b[37m%s\x1b[0m", "workers started");
};

module.exports = workers;
