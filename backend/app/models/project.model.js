const {
    Deferrable
} = require("sequelize");

module.exports = function (sequelize, Sequelize) {
    const Project = sequelize.define("project", {
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
        },
        description: {
            type: Sequelize.TEXT
        },
        discount: {
            type: Sequelize.DOUBLE
        },
        status: {
            type: Sequelize.STRING
        }
    });

    return Project;
};