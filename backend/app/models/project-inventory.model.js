module.exports = function (sequelize, Sequelize) {
    const ProjectInventory = sequelize.define("projectinventory", {
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
        customPrice: {
            type: Sequelize.INTEGER
        }
    });

    return ProjectInventory;
};