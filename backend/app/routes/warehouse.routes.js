const {
  authJwt
} = require("../middleware");
const warehouses = require("../controllers/warehouse.controller.js");

module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  var router = require("express").Router();

  // Create a new warehouse
  router.post("/", warehouses.create);

  // Retrieve all warehouses
  router.get("/", warehouses.findAll);

  // Retrieve a single warehouse with id
  router.get("/:id", warehouses.findOne);

  // Update a warehouse with id
  router.put("/:id", warehouses.update);

  // Delete a warehouse with id
  router.delete("/:id", warehouses.delete);

  app.use('/api/warehouses', [authJwt.verifyToken, authJwt.isAdmin], router);
};