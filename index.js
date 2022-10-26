const workers = require("./workers");
const server = require("./server");
const expressApp = require("./expressServer");

const api = {};

api.init = () => {
  console.clear();
  workers.init();
  server.init();
  expressApp.init();
};

api.init();
