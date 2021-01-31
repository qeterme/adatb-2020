const { Deferrable } = require("sequelize");

module.exports = function (sequelize, Sequelize) {
    const Category = sequelize.define("category", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        parentId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id',
                deferrable: Deferrable.INITIALLY_DEFERRED
            }
        }
    });

    return Category;
};