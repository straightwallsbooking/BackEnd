import db from '../models/index.js'
import { ReE, ReS } from '../utils/response.js';
import {acceptRequestU,rejectRequestU} from '../utils/timeOffUtils'
import { getRequestsTimeOffOfAllEmployeesForManager, getRequestsTimeOffOfSpecificEmployee,getEmployeesTimeOffStatusForADate } from '../utils/timeOffUtils'
const _employee = db.models.employee;
const _timeoff = db.models.timeoff

export const getMyEmployees = async (req, res) => {
    const { id } = req
    return ReS(res, "Employees which you are managing", (await _employee.findAll({ where: { manager_id: id } })), 200)
}
export const getMyEmployeesRequests = async (req, res) => {
    const { id } = req
    const requests = await getRequestsTimeOffOfAllEmployeesForManager(id)
    return ReS(res, "Found Employee's requests for manager", { requests }, 200)
}
export const getSpecificEmployeeRequests = async (req, res) => {
    const { id } = req
    const { employee_id } = req.body
    const requests = await getRequestsTimeOffOfSpecificEmployee(id, employee_id)
    return ReS(res, `Found requests for employee with id ${employee_id}`, { requests }, 200)
}
export const getEmployeesStatusOnDate = async (req,res) =>{
    const {id} =req
    const manager = await _employee.findByPk(id)
    const {date} = req.body
    const response = await getEmployeesTimeOffStatusForADate(date,manager.department_id,id)
    return ReS(res,"Found Employees Status For Manager",response,200) 
}
export const acceptRequest = async (req, res) => {
    const { id } = req
    const { req_id } = req.body
    const done = await acceptRequestU(req_id)
    if(!done) return ReE(res,"Could not complete the operation",null,500)
    return ReS(res,"Request Has Been Accepted",null,200)
    
}
export const rejectRequest = async (req, res) => {
    const { id } = req
    const { req_id } = req.body
    const done = await rejectRequestU(req_id)
    if(!done) return ReE(res,"Could not complete the operation",null,500)
    return ReS(res,"Request Has Been Rejected",null,200)
}