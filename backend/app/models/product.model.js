const { Deferrable } = require("sequelize");

module.exports = function(sequelize, Sequelize) {
    const Product = sequelize.define("product", {
      name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      vatrate: {
        type: Sequelize.DOUBLE
      },
      barcode: {
        type: Sequelize.STRING
      },
      manufacturerId: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'categories',
            key: 'id',
            deferrable: Deferrable.INITIALLY_DEFERRED
          }
      },
      description: {
        type: Sequelize.TEXT
      }
    });
  
    return Product;
  };