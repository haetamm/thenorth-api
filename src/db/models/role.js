"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      role.belongsToMany(models.user, {
        through: "userRole",
        foreignKey: "role_id",
      });
    }
  }
  role.init(
    {
      name: {
        type: DataTypes.ENUM("USER", "ADMIN"),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "role",
      underscored: true,
    }
  );
  return role;
};
