const { encrypt } = require("../utils");
const { User, Order } = require("../models");
const uniqid = require("uniqid");
const midtransClient = require("midtrans-client");
class Controller {
  static async Home(req, res) {
    const { name, email, photo, id } = req.user;
    const order = await Order.findAll({
      where: {
        UserId: id,
      },
    });
    res.render("home", { name, email, photo, order });
  }
  static Login(req, res) {
    if (req.user) {
      res.redirect("/");
      return;
    }
    res.render("login", { user: req.user, message: req.flash("error") });
  }
  static Register(req, res) {
    if (req.user) {
      res.redirect("/");
      return;
    }
    res.render("register");
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
    const order = await Order.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    res.render("admin", { user, data, order });
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

  static async Order(req, res) {
    const { productid, amount } = req.body;
    const orderid = uniqid.time().toUpperCase();

    const payload = {
      id: orderid,
      amount,
      productid,
      status: "pending",
      UserId: req.user.id,
    };
    const order = await Order.create(payload);

    res.status(200).json({
      status: "Succes",
      message: "Pesanan Ditambahkan",
      data: order,
    });
  }

  static async payOrder(req, res) {
    const { id } = req.body;
    const order = await Order.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
    });

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-lyfYEupSpznuRA8nKtsc7UW6",
    });

    let parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: order.amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: order.User.name,
        email: order.User.email,
      },
    };

    snap.createTransaction(parameter).then((transaction) => {
      // transaction token
      let transactionToken = transaction.token;
      res.status(200).json({
        transactionToken: transactionToken,
        redirect_url: transaction.redirect_url,
      });
    });
  }
  static async deleteOrder(req, res) {
    const id = req.params.id;
    const deleted = await Order.destroy({
      where: {
        id,
      },
      returning: true,
    });
    res.redirect("/admin");
  }

  static async paymentHandling(req, res) {
    const { order_id, transaction_status, payment_type } = req.body;

    let status;
    if (transaction_status == "settlement" || transaction_status == "capture") {
      status = "success";
    }
    const values = {
      status,
      method: payment_type,
    };
    const updated = await Order.updated(values, {
      where: {
        id: order_id,
      },
    });

    res.sendStatus(200);
  }
}

module.exports = Controller;
