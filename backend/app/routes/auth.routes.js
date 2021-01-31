const {
  verifySignUp
} = require("../middleware");
const {
  authJwt
} = require("../middleware");
const auth = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();

  router.post("/signup", [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], auth.signup);

  router.post("/signin", auth.signin);

  app.use("/api/auth", router);
};