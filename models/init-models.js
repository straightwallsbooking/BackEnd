var DataTypes = require("sequelize").DataTypes;
var _addresses = require("./addresses");
var _calendar = require("./calendar");
var _department = require("./department");
var _employee = require("./employee");
var _leave = require("./leave");
var _login = require("./login");
var _publicholiday = require("./publicholiday");
var _requesttimeoff = require("./requesttimeoff");
var _role = require("./role");
var _status = require("./status");
var _timeoff = require("./timeoff");

function initModels(sequelize) {
  var addresses = _addresses(sequelize, DataTypes);
  var calendar = _calendar(sequelize, DataTypes);
  var department = _department(sequelize, DataTypes);
  var employee = _employee(sequelize, DataTypes);
  var leave = _leave(sequelize, DataTypes);
  var login = _login(sequelize, DataTypes);
  var publicholiday = _publicholiday(sequelize, DataTypes);
  var requesttimeoff = _requesttimeoff(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var status = _status(sequelize, DataTypes);
  var timeoff = _timeoff(sequelize, DataTypes);

  employee.belongsTo(addresses, { as: "address", foreignKey: "address_id"});
  addresses.hasMany(employee, { as: "employees", foreignKey: "address_id"});
  employee.belongsTo(department, { as: "department", foreignKey: "department_id"});
  department.hasMany(employee, { as: "employees", foreignKey: "department_id"});
  employee.belongsTo(employee, { as: "manager", foreignKey: "manager_id"});
  employee.hasMany(employee, { as: "employees", foreignKey: "manager_id"});
  login.belongsTo(employee, { as: "employee", foreignKey: "employee_id"});
  employee.hasOne(login, { as: "login", foreignKey: "employee_id"});
  requesttimeoff.belongsTo(employee, { as: "approver", foreignKey: "approver_id"});
  employee.hasMany(requesttimeoff, { as: "requesttimeoffs", foreignKey: "approver_id"});
  requesttimeoff.belongsTo(employee, { as: "employee", foreignKey: "employee_id"});
  employee.hasMany(requesttimeoff, { as: "employee_requesttimeoffs", foreignKey: "employee_id"});
  timeoff.belongsTo(employee, { as: "employee", foreignKey: "employee_id"});
  employee.hasOne(timeoff, { as: "timeoff", foreignKey: "employee_id"});
  requesttimeoff.belongsTo(leave, { as: "leave", foreignKey: "leave_id"});
  leave.hasMany(requesttimeoff, { as: "requesttimeoffs", foreignKey: "leave_id"});
  employee.belongsTo(role, { as: "role", foreignKey: "role_id"});
  role.hasMany(employee, { as: "employees", foreignKey: "role_id"});
  requesttimeoff.belongsTo(status, { as: "status", foreignKey: "status_id"});
  status.hasMany(requesttimeoff, { as: "requesttimeoffs", foreignKey: "status_id"});

  return {
    addresses,
    calendar,
    department,
    employee,
    leave,
    login,
    publicholiday,
    requesttimeoff,
    role,
    status,
    timeoff,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
