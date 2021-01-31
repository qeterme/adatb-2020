const {
  authJwt
} = require("../middleware");
const inventories = require("../controllers/project-inventory.controller.js");

module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new Inventory in a Project
  app.post("/api/projects/:projectId/inventory/", [authJwt.verifyToken], inventories.create);

  // Retrieve all Inventories in a Project
  app.get("/api/projects/:projectId/inventory/", [authJwt.verifyToken], inventories.findAll);

  // Retrieve a single Inventory with id and Project id
  app.get("/api/projects/:projectId/inventory/:id", [authJwt.verifyToken], inventories.findOne);

  // Update a Inventory with id and Project id
  app.put("/api/projects/:projectId/inventory/:id", [authJwt.verifyToken], inventories.update);

  // Delete a Inventory with id and Project id
  app.delete("/api/projects/:projectId/inventory/:id", [authJwt.verifyToken], inventories.delete);
};