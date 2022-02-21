const upload = require("./uploadMiddleware");
const authentication = require("./authentication");
const adminAuthorization = require("./adminAuthorization");
const studentAuthorization = require("./studentAuthorization");
module.exports = {
  upload,
  authentication,
  adminAuthorization,
  studentAuthorization,
};
