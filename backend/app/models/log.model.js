module.exports = function (sequelize, Sequelize) {
  const Log = sequelize.define("log", {
    text: {
      type: Sequelize.STRING
    }
  });

  return Log;
};