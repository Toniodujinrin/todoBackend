//file to write functions for CRUD operations
const mongoOps = require("../mongoConnect");

const fs = require("fs");

const path = require("path");
const helpers = require("../helpers");
const util = require("util");
const writeFilePromise = util.promisify(fs.writeFile);
const openFilePromise = util.promisify(fs.open);
const closeFilePromise = util.promisify(fs.close);
const readFilePromise = util.promisify(fs.readFile);
const truncateFilePromise = util.promisify(fs.ftruncate);
const unlickFilePromise = util.promisify(fs.unlink);
const listdirPromise = util.promisify(fs.readdir);
const lib = {};
lib.baseDirectory = path.join(__dirname, "/../.data/");

lib.post = async function (dir, file, data) {
  try {
    const res = await mongoOps.create(dir, data);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

lib.get = async function (dir, file) {
  try {
    const res = await mongoOps.read(dir, file);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

lib.put = async (dir, file, data) => {
  try {
    const res = await mongoOps.update(dir, file, data);
    return res;
  } catch (error) {
    throw new Error("error occured when updating object");
  }
};

lib.delete = async (dir, file) => {
  try {
    const res = await mongoOps.delete(dir, file);
    return res;
  } catch (error) {
    throw new Error("error occured when deleting user");
  }
};

lib.listAll = async (folders) => {
  try {
    const res = await mongoOps.listindexes(folders);
    return res;
  } catch (error) {
    throw new Error("error reading files folder may not exist");
  }
};

module.exports = lib;
