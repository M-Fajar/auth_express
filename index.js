const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3088;
const routes = require("./routes");
const passport = require("passport");
const flash = require("connect-flash");

const session = require("express-session");

const app = express();
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
require("express-async-errors");
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");
app.use(express.static("views/assets"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);
app.all("*", (req, res) => {
  res.redirect("/");
});

app.use((err, req, res, next) => {
  res.status(500).send("<h1> 500 Internal Server Error</h1>");
});
app.listen(PORT, () => {
  console.info(`Server Runnong On http://localhost:${PORT}`);
});
