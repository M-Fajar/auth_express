const { encrypt } = require("../utils");
const { User } = require("../models");
class Controller {
  static Home(req, res) {
    const { name, email, photo } = req.user;
    res.render("home", { name, email, photo });
  }
  static Login(req, res) {
    if (req.user) {
      res.redirect("/");
      return;
    }
    res.render("login", { user: req.user, message: req.flash("error") });
  }
  static Register(req, res) {
    // if (typeof req.) {
    //   res.redirect("/");
    //   return;
    // }
    res.render("Register");
  }
  static async CreateUser(req, res) {
    let { name, email, password } = req.body;
    let photo = "pic2.png";
    if (typeof req.file !== "undefined") {
      photo = await req.file.filename;
    }
    console.log(photo);
    password = encrypt.encrptPwd(password);

    const payload = {
      name,
      email,
      photo,
      password,
    };

    try {
      const newUser = await User.create(payload);
      res.redirect("/login");
    } catch (error) {
      res.render("register", { error: "Email Sudah Terdaftar" });
    }
  }
  static async Admin(req, res) {
    const user = req.user;
    const data = await User.findAll({
      where: {
        role: "student",
      },
    });
    res.render("admin", { user, data });
  }
  static Logout(req, res) {
    req.logout();
    res.redirect("/login");
  }
  static async deleteUser(req, res) {
    const id = req.params.id;
    const deleted = await User.destroy({
      where: {
        id,
      },
      returning: true,
    });

    res.redirect("/admin");
  }
}

module.exports = Controller;
