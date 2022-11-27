const workers = require("./workers");
const server = require("./server");
const expressApp = require("./expressServer");

const api = {};

api.init = () => {
  workers.init();
 
  expressApp.init();
};

api.init();
