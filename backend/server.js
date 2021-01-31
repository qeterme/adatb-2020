const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// // drop the table if it already exists
/* db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});  */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello friend" });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require("./app/routes/product.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/warehouse.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/project.routes")(app);
require("./app/routes/inventory.routes")(app);
require("./app/routes/project-inventory.routes")(app);
require("./app/routes/log.routes")(app);
/* 
require("./app/routes/inventory.routes")(app);
require("./app/routes/log.routes")(app);
require("./app/routes/product-inventory.routes")(app);
require("./app/routes/project.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/warehouse.routes")(app); */

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "admin"
  });
}