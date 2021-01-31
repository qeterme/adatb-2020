const {
  authJwt
} = require("../middleware");
const projects = require("../controllers/project.controller.js");

module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();

  // Create a new Project
  router.post("/", projects.create);

  // Retrieve all Projects
  router.get("/", projects.findAll);

  // Retrieve a single Project with id
  router.get("/:id", projects.findById);

  // Retrieve a single Project with id
  router.get("/edit/:id", projects.findOne);

  // Update a Project with id
  router.put("/:id", projects.update);

  // Delete a Project with id
  router.delete("/:id", projects.delete);

  // Delete all Projects
  router.delete("/", projects.deleteAll);

  app.use('/api/projects', [authJwt.verifyToken], router);
};