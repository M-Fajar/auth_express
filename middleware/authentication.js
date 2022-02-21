function authentication(req, res, next) {
  const userLogin = req.user;
  if (!userLogin) {
    res.redirect("/login");
    return;
  }
  next();
}
module.exports = authentication;
