const post = require("./taskHandlers/taskPost");
const get = require("./taskHandlers/taskGet");
const put = require("./taskHandlers/taskPut");
const Delete = require("./taskHandlers/taskDelete");

const taskHandlers = {};
taskHandlers.post = post;
taskHandlers.get = get;
taskHandlers.put = put;
taskHandlers.delete = Delete;

module.exports = taskHandlers;
