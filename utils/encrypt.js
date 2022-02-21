const bcrypt = require("bcryptjs");

class Encrypt {
  static encrptPwd(raw) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(raw, salt);
      return hash;
    } catch (error) {
      return null;
    }
  }
  static isPwdValid(raw, hash) {
    try {
      return bcrypt.compareSync(raw, hash);
    } catch (error) {
      return null;
    }
  }
}
module.exports = Encrypt;
