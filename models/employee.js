const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return employee.init(sequelize, DataTypes);
}

class employee extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    department_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'department',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    address_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id'
      }
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    hire_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    salary: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    pendingReviews: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    manager_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'employee',
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
        name: "address_id",
        using: "BTREE",
        fields: [
          { name: "address_id" },
        ]
      },
      {
        name: "manager_id",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
      {
        name: "department_id",
        using: "BTREE",
        fields: [
          { name: "department_id" },
        ]
      },
      {
        name: "role_id",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
    ]
  });
  return employee;
  }
}
