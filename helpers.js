const { builtinModules } = require("module");
const crypto = require("crypto");
require("dotenv").config();

const helpers = {};

helpers.parseJsonString = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (error) {
    return {};
  }
};

helpers.hash = function (str) {
  const hash = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(str)
    .digest("hex");
  return hash;
};

module.exports = helpers;
