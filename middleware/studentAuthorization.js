function studentAuthorization(req, res, next) {
  const userLogin = req.user;

  if (userLogin.role == "student") {
    next();
    return;
  }
  if (userLogin.role == "admin") {
    res.redirect("/admin");
    return;
  }
  res.redirect("/login");
  return;
}
module.exports = studentAuthorization;
