const userHandlers = require("./userHandlers");

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

module.exports = handlers;
