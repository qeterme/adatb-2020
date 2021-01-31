const {
  Deferrable
} = require("sequelize");

module.exports = function (sequelize, Sequelize) {
  const Inventory = sequelize.define("inventory", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: Sequelize.INTEGER
    },
    unit: {
      type: Sequelize.STRING
    },
    aisle: {
      type: Sequelize.INTEGER
    },
    bin: {
      type: Sequelize.INTEGER
    }
  });

  return Inventory;
};