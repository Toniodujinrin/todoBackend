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

helpers.createRandomString = (length) => {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  let str = "";
  if (length) {
    for (i = 0; i < length; i++) {
      const randomLetter = chars.at(Math.round(Math.random() * length));
      str += randomLetter;
    }
    return str;
  } else return false;
};

module.exports = helpers;
