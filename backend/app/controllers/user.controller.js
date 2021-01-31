const {
  user
} = require("../models");
const db = require("../models");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? {
    username: {
      [Op.like]: `%${name}%`
    }
  } : null;

  User.findAll({
      where: condition,
      attributes: ['id', 'username', 'fullname', 'email']
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
}

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      delete data["dataValues"]["password"];
      delete data["dataValues"]["createdAt"];
      delete data["dataValues"]["updatedAt"];

      var authorities = [];
      data.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].id);
        }

        res.status(200).send({
          id: data.id,
          username: data.username,
          fullname: data.fullname,
          email: data.email,
          roles: authorities
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id " + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  updateRole(req);

  var request = req.body;
  if ('password' in req.body) {
    if (req.body.password != '') {
      request.password = bcrypt.hashSync(req.body.password, 8);
    }
  }

  User.update(request, {
      where: {
        id: id
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id ${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id " + id
      });
    });
};

exports.updateSelf = (req, res) => {
  const id = req.params.id;

  var request = req.body;
  if ('password' in req.body) {
    if (req.body.password != '') {
      request.password = bcrypt.hashSync(req.body.password, 8);
    }
  }

  if (req.userId != id) {
    res.send(403).send({
      message: "No permission to update others."
    });
    return;
  }

  User.update(request, {
      where: {
        id: id
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id ${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id " + id
      });
    });
};

updateRole = (req) => {
  User.findOne({
    where: {
      id: req.body.id
    }
  }).then(user => {
    Role.findAll({
      where: {
        id: {
          [Op.or]: req.body.roles
        }
      }
    }).then(roles => {
      user.setRoles(roles).then(() => {});
    });
    user.save();
  });
}

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
      where: {
        id: id
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id ${id}. Maybe User does not exsits!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id " + id
      });
    });
};