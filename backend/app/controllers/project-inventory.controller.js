const {
  warehouse
} = require("../models");
const db = require("../models");
const ProjectInventory = db.projectInventory;
const Product = db.product;
const Project = db.project;
const Log = db.log;
const Op = db.Sequelize.Op;

// Create and Save a new Inventory
exports.create = (req, res) => {
  // Validate request
  if (!req.body.productId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Inventory
  const inventory = {
    amount: req.body.amount,
    unit: req.body.unit,
    customPrice: req.body.customPrice,
    productId: req.body.productId,
    projectId: req.params.projectId,
  };

  // Save Inventory in the database
  ProjectInventory.create(inventory)
    .then(data => {
      Product.findByPk(req.body.productId)
        .then(product => {
          data.setProduct(product);
        });

      Project.findByPk(req.body.projectId)
        .then(project => {
          data.setWarehouse(project);
        });

      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Inventory."
      });
    });

  Log.create({
    text: `#${req.userId} felhasználó új terméket adott a(z) #${req.params.projectId} projekthez. Termék: #${req.body.productId} Mennyiség: ${req.body.amount} ${req.body.unit} ${req.body.customPrice > 0 ? 'Egyedi ár:' + req.body.customPrice : ''}`
  })
};

// Retrieve all Inventories from the database.
exports.findAll = (req, res) => {
  console.log(req);
  const projectId = req.params.projectId;

  ProjectInventory.findAll({
      where: {
        projectId: projectId,
      },
      include: [Product]
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving inventories."
      });
    });
};

// Find a single Inventory with an id
exports.findOne = (req, res) => {
  const projectId = req.params.projectId;

  ProjectInventory.findOne({
      where: {
        projectId: projectId,
        id: req.params.id
      },
      include: [Product, Project]
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Inventory with id " + id
      });
    });
};

// Update a Inventory by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  const projectId = req.params.projectId;

  ProjectInventory.update(req.body, {
      where: {
        projectId: projectId,
        id: id
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Inventory was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Inventory with id ${id}. Maybe Inventory does not exists or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Inventory with id " + id
      });
    });

  Log.create({
    text: `#${req.userId} felhasználó frissítette a(z) #${id} készletet a(z) #${projectId} projektben. Termék: #${req.body.productId} Mennyiség: ${req.body.amount} ${req.body.unit} ${req.body.customPrice > 0 ? 'Egyedi ár:' + req.body.customPrice : ''}`
  })
};

// Delete a Inventory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  const projectId = req.params.projectId;

  ProjectInventory.destroy({
      where: {
        projectId: projectId,
        id: id
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Inventory was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Inventory with id ${id}. Maybe Inventory does not exsits!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Inventory with id " + id
      });
    });

  Log.create({
    text: `#${req.userId} felhasználó törölte a(z) #${id} készletet a #${projectId} projektből`
  })
};
