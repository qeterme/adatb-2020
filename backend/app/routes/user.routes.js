const {
  authJwt
} = require("../middleware");
const users = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();

  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], users.findAll);

  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], users.findOne);

  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], users.update);

  router.put("/self/:id", [authJwt.verifyToken], users.updateSelf);

  router.get("/test", users.userBoard);

  router.get("/test/admin", [authJwt.verifyToken, authJwt.isAdmin], users.adminBoard);

  app.use('/api/users', [authJwt.verifyToken], router);
};