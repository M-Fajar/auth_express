function adminAuthorization(req, res, next) {
  const userLogin = req.user;
  if (userLogin.role == "admin") {
    next();
    return;
  }
  if (userLogin.role == "student") {
    res.redirect("/");
    return;
  }
  res.redirect("/login");
  return;
}
module.exports = adminAuthorization;
