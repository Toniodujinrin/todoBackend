const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

const mongoOps = {};

mongoOps.create = async (collection, data) => {
  try {
    await client.connect();
    const res = await client
      .db("timeline_database")
      .collection(collection)
      .insertOne(data);
    if (res) {
      return "successful";
    }
  } catch (error) {
    throw new Error(error);
  }
};

mongoOps.update = async (collection, id, data) => {
  try {
    await client.connect();
    const res = await client
      .db("timeline_database")
      .collection(collection)
      .updateOne({ _id: id }, { $set: data });
    if (res) {
      return "successful";
    } else {
      throw new Error("failed to update db");
    }
  } catch (error) {
    throw new Error(error);
  }
};

mongoOps.delete = async (collection, id) => {
  try {
    await client.connect();
    const res = await client
      .db("timeline_database")
      .collection(collection)
      .deleteOne({ _id: id });
    if (res) {
      return res;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
mongoOps.read = async (collection, id) => {
  try {
    await client.connect();
    const res = await client
      .db("timeline_database")
      .collection(collection)
      .findOne({ _id: id });
    if (res) {
      return res;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

mongoOps.listindexes = async (currentCollection) => {
  try {
    await client.connect();
    const listofFiles = [];
    const db = await client.db("timeline_database");
    const cursor = await db.collection(currentCollection).find({});
    const allValues = await cursor.toArray();
    allValues.map((item) => listofFiles.push(item._id));

    if (listofFiles.length > 0) {
      return listofFiles;
    } else {
      console.log("no result from mongoDb");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = mongoOps;
