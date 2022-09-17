//file to write functions for CRUD operations

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
const lib = {};
lib.baseDirectory = path.join(__dirname, "/../.data/");

lib.post = async function (dir, file, data) {
  try {
    const stringData = JSON.stringify(data);
    const fd = await openFilePromise(
      `${lib.baseDirectory}${dir}/${file}.json`,
      "wx"
    );
    await writeFilePromise(fd, stringData);
    await closeFilePromise(fd);
  } catch (error) {
    throw new Error("error occured when creating file");
  }
};

lib.get = async function (dir, file) {
  try {
    const data = await readFilePromise(
      `${lib.baseDirectory}${dir}/${file}.json`,
      "utf-8"
    );
    return helpers.parseJsonString(data);
  } catch (error) {
    throw new Error("error occured when reading file");
  }
};

lib.put = async (dir, file, data) => {
  try {
    const stringData = JSON.stringify(data);
    const fd = await openFilePromise(
      `${lib.baseDirectory}${dir}/${file}.json`,
      "r+"
    );
    await truncateFilePromise(fd);
    await writeFilePromise(fd, stringData);
    await closeFilePromise(fd);
  } catch (error) {
    throw new Error("error occured when updating object");
  }
};

lib.delete = async (dir, file) => {
  try {
    await unlickFilePromise(`${lib.baseDirectory}${dir}/${file}.json`);
  } catch (error) {
    throw new Error("error occured when deleting user");
  }
};

module.exports = lib;
