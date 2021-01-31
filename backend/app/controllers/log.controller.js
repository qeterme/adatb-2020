const db = require("../models");
const Log = db.log;

exports.findAll = (req, res) => {  
    Log.findAll({
      order: [
        ['createdAt', 'DESC'],
      ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err.message);
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving logs."
        });
      });
  }