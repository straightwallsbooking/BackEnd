const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return requesttimeoff.init(sequelize, DataTypes);
}

class requesttimeoff extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    leave_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'leave',
        key: 'id'
      }
    },
    approver_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'manager_id'
      }
    },
    status_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'status',
        key: 'id'
      }
    },
    requestStartTime: {
      type: 'TIMESTAMP',
      defaultValue:sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalDays: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    requestReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    requestTimeout: {
      type: DataTypes.DATE,
      allowNull: true
    },
    peaktime_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    alternateStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    alternateEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    alternateAccepted: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approvalDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    approvalReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    denialReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approvalTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'requesttimeoff',
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
        name: "employee_id_idx",
        using: "BTREE",
        fields: [
          { name: "employee_id" },
        ]
      },
      {
        name: "leave_id_idx",
        using: "BTREE",
        fields: [
          { name: "leave_id" },
        ]
      },
      {
        name: "status_id_idx",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
      {
        name: "requestTimeOff_approver_id_idx",
        using: "BTREE",
        fields: [
          { name: "approver_id" },
        ]
      },
    ]
  });
  return requesttimeoff;
  }
}
