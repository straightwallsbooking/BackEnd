import db from '../models/index.js'
import { ReS } from '../utils/response.js';
const _employee = db.models.employee;
const _timeoff = db.models.timeoff

export const getMyEmployees = async (req,res) =>{
    const {id} =req.body
    return ReS(res,"Employees which you are managing",(await _employee.findAll({where:{manager_id:id}}) ),200)
}