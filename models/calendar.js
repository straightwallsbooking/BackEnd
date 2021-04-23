const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return calendar.init(sequelize, DataTypes);
}

class calendar extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "date_UNIQUE"
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    day_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    month_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    holiday_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "f"
    },
    peaktime_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "f"
    },
    weekend_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "f"
    },
    event: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'calendar',
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
  return calendar;
  }
}
