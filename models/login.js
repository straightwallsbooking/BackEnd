const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return login.init(sequelize, DataTypes);
}

class login extends Sequelize.Model {
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email_UNIQUE"
    },
    password: {
      type: DataTypes.CHAR(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'login',
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
      {
        name: "email_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
  return login;
  }
}
