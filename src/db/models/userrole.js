"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userRole.belongsTo(models.user, {
        foreignKey: "user_id",
      });
      // Relasi ke Role
      userRole.belongsTo(models.role, {
        foreignKey: "role_id",
      });
    }
  }
  userRole.init(
    {
      user_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "userRole",
      underscored: true,
    }
  );
  return userRole;
};
