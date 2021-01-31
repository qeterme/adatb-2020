const {
  authJwt
} = require("../middleware");
const logs = require("../controllers/log.controller.js");

module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
    var router = require("express").Router();
  
    // Retrieve all logs
    router.get("/", logs.findAll);
  
    app.use('/api/logs', [authJwt.verifyToken], router);
  };