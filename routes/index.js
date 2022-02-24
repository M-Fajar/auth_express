const route = require("express").Router();
const Controller = require("../controllers");
const { upload } = require("../middleware");
const passport = require("passport");
const {
  authentication,
  adminAuthorization,
  studentAuthorization,
} = require("../middleware");

route.get("/login", Controller.Login);
route.get("/register", Controller.Register);
route.post("/register", upload.single("image"), Controller.CreateUser);
route.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
route.post("/order/payment/handling", Controller.paymentHandling);
route.use(authentication);
route.get("/", studentAuthorization, Controller.Home);
route.get("/admin", adminAuthorization, Controller.Admin);
route.get("/delete/:id", adminAuthorization, Controller.deleteUser);
route.get("/order/delete/:id", adminAuthorization, Controller.deleteOrder);
route.post("/logout", Controller.Logout);
route.post("/order", Controller.Order);
route.post("/order/pay", Controller.payOrder);

module.exports = route;
