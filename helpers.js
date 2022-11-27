const crypto = require("crypto");
require("dotenv").config();
const nodemailer = require("nodemailer");
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

helpers.sendNodeMailer = (userEmail, message) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.TEST_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });



  let details = {
    from: "Timeline",
    to: userEmail,
    subject: "Task Alert",
    text: message,
    
  };

  transporter.sendMail(details, (err) => {
    if (err) {
      console.log("error sending mail");
   
    } else {
      console.log(
        "\x1b[34m%s\x1b[0m",
        `email successfuly sent to ${userEmail}`
      );
    }
  });
};

module.exports = helpers;
