const userHandlers = require("./userHandlers");
const tokenHandlers = require("./tokenHandlers");
const tasksHanlders = require("./taskHanlders");
const handlers = {};
handlers.notFound = (data, callback) => {
  callback(404, { message: "page not found" });
};

handlers.users = (data, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(403, { error: "request methos is not allowed" });
  }
};

handlers.tokens = (data, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(403, { error: "requested method is not allowed" });
  }
};

handlers.tasks = (data, callback) => {
  const acceptedMethods = ["get", "put", "post", "delete"];
  if (acceptedMethods.indexOf(data.method) > -1) {
    handlers._tasks[data.method](data, callback);
  } else {
    callback(403, { error: "requested method is not allowed" });
  }
};

handlers._tasks = {};

handlers._tasks.post = (data, callback) => {
  tasksHanlders.post(data, callback);
};
handlers._tasks.get = (data, callback) => {
  tasksHanlders.get(data, callback);
};
handlers._tasks.put = (data, callback) => {
  tasksHanlders.put(data, callback);
};
handlers._tasks.delete = (data, callback) => {
  tasksHanlders.delete(data, callback);
};

handlers._users = {};
handlers._users.post = (data, callback) => {
  userHandlers.post(data, callback);
};
handlers._users.put = (data, callback) => {
  userHandlers.put(data, callback);
};
handlers._users.delete = (data, callback) => {
  userHandlers.delete(data, callback);
};
handlers._users.get = (data, callback) => {
  userHandlers.get(data, callback);
};

handlers._tokens = {};
handlers._tokens.post = (data, callback) => {
  tokenHandlers.post(data, callback);
};
handlers._tokens.put = (data, callback) => {
  tokenHandlers.put(data, callback);
};
handlers._tokens.delete = (data, callback) => {
  tokenHandlers.delete(data, callback);
};
handlers._tokens.get = (data, callback) => {
  tokenHandlers.get(data, callback);
};

module.exports = handlers;
