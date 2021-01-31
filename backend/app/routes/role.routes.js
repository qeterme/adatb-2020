const {
    authJwt
  } = require("../middleware");
  const roles = require("../controllers/role.controller.js");
  
  module.exports = app => {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
      var router = require("express").Router();
    
      // Retrieve all warehouses
      router.get("/", roles.findAll);
    
      app.use('/api/roles', [authJwt.verifyToken, authJwt.isAdmin], router);
    };