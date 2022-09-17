const post = require("./userHandlers/userPost");
const get = require("./userHandlers/userGet");
const put = require("./userHandlers/userPut");
const Delete = require("./userHandlers/userDelete");

const userHandlers = {};
userHandlers.post = post;
userHandlers.get = get;
userHandlers.put = put;
userHandlers.delete = Delete;
module.exports = userHandlers;
