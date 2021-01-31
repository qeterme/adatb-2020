const {
  warehouse
} = require("../models");
const db = require("../models");
const Inventory = db.inventory;
const Product = db.product;
const Warehouse = db.warehouse;
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
    aisle: req.body.aisle,
    bin: req.body.bin,
    productId: req.body.productId,
    warehouseId: req.body.warehouseId,
  };

  // Save Inventory in the database
  Inventory.create(inventory)
    .then(data => {
      Product.findByPk(req.body.productId)
        .then(product => {
          data.setProduct(product);
        });

      Warehouse.findByPk(req.body.warehouseId)
        .then(warehouse => {
          data.setWarehouse(warehouse);
        });

      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Inventory."
      });
    });

  Log.create({
    text: `#${req.userId} felhasználó új készletet vitt fel. Termék: #${req.body.productId} Mennyiség: ${req.body.amount} ${req.body.unit} A(z) ${req.body.warehouseId} raktár ${req.body.aisle} sor ${req.body.bin} polcán.`
  })
};

// Retrieve all Inventories from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? {
    name: {
      [Op.like]: `%${name}%`
    }
  } : null;

  Inventory.findAll({
      where: condition,
      include: [Product, Warehouse]
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
  Inventory.findOne({
      where: {
        id: req.params.id
      },
      include: [Product, Warehouse]
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

  Inventory.update(req.body, {
      where: {
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
    text: `#${req.userId} felhasználó frissítette a(z) #${req.params.id} készletet. Termék: #${req.body.productId} Mennyiség: ${req.body.amount} ${req.body.unit} A(z) ${req.body.warehouseId} raktár ${req.body.aisle} sor ${req.body.bin} polcán.`
  })
};

// Delete a Inventory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Inventory.destroy({
      where: {
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
    text: `#${req.userId} felhasználó törölte a(z) #${req.params.id} készletet.`
  })
};
