const db = require("../models");
const Project = db.project;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Project
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Project
  const project = {
    name: req.body.name,
    address: req.body.address,
    description: req.body.description,
    discount: req.body.discount,
    status: req.body.status,
  };

  // Save Project in the database
  Project.create(project)
    .then(data => {
      User.findAll({
        where: {
          id: {
            [Op.or]: req.body.participants
          }
        }
      }).then(user => {
        data.setUsers(user).then(() => {});
      });
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Project."
      });
    });
};

// Retrieve all Projects from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? {
    name: {
      [Op.like]: `%${name}%`
    }
  } : null;

  const status = req.query.status;
  condition = status ? {
    status: {
      [Op.like]: `%${status}%`
    }
  } : null;

  Project.findAll({
      where: condition,
      include: [{
        model: User,
        attributes: ['id', 'username', 'fullname']
      }]
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Projects."
      });
    });
};

// Find a single Project with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log(req);

  Project.findByPk(id)
    .then(data => {
      var participants = [];
      data.getUsers().then(users => {
        for (let i = 0; i < users.length; i++) {
          console.log(users[i]);
          participants.push(users[i].id);
        }

        res.status(200).send({
          id: data.id,
          name: data.name,
          address: data.address,
          description: data.description,
          discount: data.discount,
          status: data.status,
          participants: participants
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project with id=" + id
      });
    }); 
};

exports.findById = (req, res) => {
  const id = req.params.id;

  Project.findOne({
    where: {
      id: id
    },
    include: [{
      model: User,
      attributes: ['id', 'username', 'fullname']
    }]
  }).then(data => {
    res.send(data);
  }).catch(error => {
    res.status(500).send({
      message: err.message || "Error retrieving Project with id=" + id
    })
  })
}

// Update a Project by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  updateUsers(req);

  Project.update(req.body, {
      where: {
        id: id
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Project was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Project with id ${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Project with id " + id
      });
    });
};

updateUsers = (req) => {
  Project.findOne({
    where: {
      id: req.body.id
    }
  }).then(project => {
    User.findAll({
      where: {
        id: {
          [Op.or]: req.body.participants
        }
      }
    }).then(users => {
      project.setUsers(users).then(() => {});
    });
    project.save();
  });
}

// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Project.destroy({
      where: {
        id: id
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Project was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Project with id ${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Project with id " + id
      });
    });
};

// Delete all Projects from the database.
exports.deleteAll = (req, res) => {
  Project.destroy({
      where: {},
      truncate: false
    })
    .then(nums => {
      res.send({
        message: `${nums} Projects were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Projects."
      });
    });
};