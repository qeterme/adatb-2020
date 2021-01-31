const {
  authJwt
} = require("../middleware");
const inventories = require("../controllers/inventory.controller.js");

module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();

  // Create a new Inventory
  router.post("/", inventories.create);

  // Retrieve all Inventories
  router.get("/", inventories.findAll);

  // Retrieve a single Inventory with id
  router.get("/:id", inventories.findOne);

  // Update a Inventory with id
  router.put("/:id", inventories.update);

  // Delete a Inventory with id
  router.delete("/:id", inventories.delete);

  app.use('/api/inventory', [authJwt.verifyToken], router);
};