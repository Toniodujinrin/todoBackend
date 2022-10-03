const post = require("./tokenHandlers/tokenPost");
const Delete = require("./tokenHandlers/tokenDelete");
const get = require("./tokenHandlers/tokenGet");
const put = require("./tokenHandlers/tokenPut");

const tokenHandlers = {};
tokenHandlers.post = post;
tokenHandlers.get = get;
tokenHandlers.put = put;
tokenHandlers.delete = Delete;
module.exports = tokenHandlers;
