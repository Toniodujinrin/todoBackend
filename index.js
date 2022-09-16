//main file for the todo backend server api

const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  //taking the url gotten from the req and parsing it
  const parsedUrl = url.parse(req.url, true);
  //get the path from the parsed url
  const path = parsedUrl.pathname;
  //getting the trimmed path that you will work with
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //getting all data needed from the
});
console.log(process.env.NODE_ENV);
server.listen(3000, () => {
  console.log("server is listening on port 3000");
});
