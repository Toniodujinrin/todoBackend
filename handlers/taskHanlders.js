const post = require("./taskHandlers/taskPost");
const get = require("./taskHandlers/taskGet");

const taskHandlers = {};
taskHandlers.post = post;
taskHandlers.get = get;

module.exports = taskHandlers;
