const {
    Deferrable
} = require("sequelize");

module.exports = function (sequelize, Sequelize) {
    const Warehouse = sequelize.define("warehouse", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        }
    });

    return Warehouse;
};