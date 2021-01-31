const db = require("../models");
const Role = db.role;

exports.findAll = (req, res) => {
    Role.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err.message);
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving roles."
        });
      });
  }