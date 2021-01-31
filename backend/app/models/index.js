const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.category = require("./category.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.warehouse = require("../models/warehouse.model.js")(sequelize, Sequelize);
db.project = require("../models/project.model.js")(sequelize, Sequelize);
db.inventory = require("../models/inventory.model.js")(sequelize, Sequelize);
db.projectInventory = require("../models/project-inventory.model.js")(sequelize, Sequelize);
db.log = require("../models/log.model.js")(sequelize, Sequelize);

// Role - User connections
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin"];

// Project - User connections
db.project.belongsToMany(db.user, {
  through: "user_projects",
  foreignKey: "projectId",
  otherKey: "userId"
});
db.user.belongsToMany(db.project, {
  through: "user_projects",
  foreignKey: "userId",
  otherKey: "projectId"
});

// Inventory - Product, Warehouse connections
db.product.hasMany(db.inventory);
db.warehouse.hasMany(db.inventory);

db.inventory.belongsTo(db.product);
db.inventory.belongsTo(db.warehouse);

// Project inventory - Product, Project connections
db.product.hasMany(db.projectInventory);
db.project.hasMany(db.projectInventory);

db.projectInventory.belongsTo(db.product);
db.projectInventory.belongsTo(db.project);

module.exports = db;