import db from '../models/index.js'
const _timeOffRequest = db.models.requesttimeoff;
export const getRequestsTimeOff = async (id) =>{
    const timeOffRequests = await _timeOffRequest.findAll({where:{employee_id:id},include:['leave']})
    return timeOffRequests
}

export const getRequestsTimeOffOfAllEmployeesForManager = async  (m_id) =>{
    const timeOffRequests = await _timeOffRequest.findAll({where:{approver_id:m_id}})
    return timeOffRequests
}