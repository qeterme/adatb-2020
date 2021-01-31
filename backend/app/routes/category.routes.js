const {
  authJwt
} = require("../middleware");
    const categories = require("../controllers/category.controller.js");
module.exports = app => {  
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

    var router = require("express").Router();
  
    // Create a new Category
    router.post("/", categories.create);
  
    // Retrieve all Categories
    router.get("/", categories.findAll);
  
    // Retrieve a single Category with id
    router.get("/:id", categories.findOne);
  
    // Update a Category with id
    router.put("/:id", categories.update);
  
    // Delete a Category with id
    router.delete("/:id", categories.delete);
  
    // Delete all Categories
    router.delete("/", categories.deleteAll);
  
    app.use('/api/categories', [authJwt.verifyToken], router);
  };