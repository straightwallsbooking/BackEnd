const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return publicholiday.init(sequelize, DataTypes);
}

class publicholiday extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'publicholiday',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "date" },
        ]
      },
      {
        name: "date_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "date" },
        ]
      },
    ]
  });
  return publicholiday;
  }
}
