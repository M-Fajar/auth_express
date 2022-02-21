const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("../models");
const { encrypt } = require("../utils");

passport.use(
  new LocalStrategy(async function (email, password, done) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    const compare = user
      ? encrypt.isPwdValid(password, user.dataValues.password)
      : 0;
    if (!user || !compare)
      return done(null, false, { message: "Password and username invalid!" });

    return done(null, user);
  })
);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
