const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return leave.init(sequelize, DataTypes);
}

class leave extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    allowance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'leave',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return leave;
  }
}
