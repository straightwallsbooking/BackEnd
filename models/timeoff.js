const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return timeoff.init(sequelize, DataTypes);
}

class timeoff extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    employee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    vacationAllowance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    vacationBalance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    casualBalance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    sickBalance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    unpaidUsed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    vacationUsed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    peakTimeUsed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'timeoff',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "employee_id" },
        ]
      },
      {
        name: "employee_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "employee_id" },
        ]
      },
    ]
  });
  return timeoff;
  }
}
