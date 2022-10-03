//main file for the todo backend server api
require("dotenv").config();
const http = require("http");
const url = require("url");
const stringDecoder = require("string_decoder").StringDecoder;
const handlers = require("./handlers/handlers");
const helpers = require("./helpers");

const server = http.createServer((req, res) => {
  //taking the url gotten from the req and parsing it
  const parsedUrl = url.parse(req.url, true);
  //get the path from the parsed url
  const path = parsedUrl.pathname;
  //getting the trimmed path that you will work with
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //getting all data needed from the browser
  const method = req.method.toLowerCase();
  const params = req.params;
  //getting headers
  const headers = req.headers;
  const queryStringObject = parsedUrl.query;
  //getting the payload
  const decoder = new stringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();
    const parsedJsonObject = helpers.parseJsonString(buffer);

    const data = {
      payload: parsedJsonObject,
      query: queryStringObject,
      headers: headers,
      method: method,
      params: params,
    };

    //define the chosen handler that will be called
    const chosenHandler =
      typeof routes[trimmedPath] != "undefined"
        ? routes[trimmedPath]
        : routes.notFound;
    //call the chosen handler
    chosenHandler(data, (statuscode, resPayload) => {
      //choose the stauts code that is called by the handler of default to 200
      statuscode = typeof statuscode == "number" ? statuscode : 200;
      //get the payload and stringify it
      resPayload = typeof resPayload == "object" ? resPayload : {};
      const stringPayload = JSON.stringify(resPayload);
      //return the response to the browser via res
      res.writeHead(statuscode);
      //res.setHeader("Content-type", "application/json");
      res.write(stringPayload);
      res.end();
      console.log(statuscode, stringPayload);
    });
  });
});

//defining routes
const routes = {
  notFound: handlers.notFound,
  users: handlers.users,
  tokens: handlers.tokens,
  tasks: handlers.tasks,
};

server.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});
