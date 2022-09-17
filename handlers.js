const handlers = {};
handlers.notFound = (data, callback) => {
  callback(404, { message: "page is not found" });
};

module.exports = handlers;
