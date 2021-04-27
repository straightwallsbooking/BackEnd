import moment from 'moment';
// import employee from '../models/employee.js';
import db from '../models/index.js'
const _timeOffRequest = db.models.requesttimeoff;
const _employee = db.models.employee
const _timeoff = db.models.timeoff
const _leave = db.models.leave
const _status = db.models.status
export const getRequestsTimeOff = async (id) => {
    const timeOffRequests = await _timeOffRequest.findAll({ where: { employee_id: id }, include: ['leave'] })
    return timeOffRequests
}

export const getRequestsTimeOffOfAllEmployeesForManager = async (m_id) => {
    const timeOffRequests = await _timeOffRequest.findAll({
        where: { approver_id: m_id, status_id: 1 },
        include: [{ model: _employee, as: 'employee' },
        { model: _leave, as: 'leave' },
        { model: _status, as: 'status' }]
    })
    return timeOffRequests
}
export const getRequestsTimeOffOfSpecificEmployee = async (m_id, e_id) => {
    const timeOffRequests = await _timeOffRequest.findAll({
        where: { approver_id: m_id, status_id: 1, employee_id: e_id },
        include: [{ model: _employee, as: 'employee' },
        { model: _leave, as: 'leave' },
        { model: _status, as: 'status' }]
    })
    return timeOffRequests
}

export const calculateTotalDays = (startDate, endDate) => {
    // exclude weekends 
    let tt = moment(startDate)
    // let ee = moment(endDate).add(1, 'day')
    let totalDay = 0
    do {
        if (![0, 6].includes(tt.day())) {
            totalDay += 1
        }
        tt.add(1, 'day')
    } while (tt <= endDate)
    return totalDay
}
export const rejectRequestU =async  (reqId) =>{
    try{
        const res = await _timeOffRequest.destroy({where:{id:parseInt(reqId)}})
        return true
    }catch(err){
        
        console.log(err.message)
        return false
    }
}
export const acceptRequestU =async  (reqId) =>{
    try{
        const request = await _timeOffRequest.findByPk(parseInt(reqId))
        request.status_id= 6
        let timeoffDetails = await _timeoff.findByPk(request.employee_id)
        console.log(timeoffDetails,request)
        const totalDays = request.totalDays
        request.save()
        timeoffDetails = await timeoffDetails.decrement('vacationBalance',{by:parseInt(request.totalDays)})
        timeoffDetails = await timeoffDetails.increment('vacationUsed',{by:parseInt(request.totalDays)})
        return true
    }catch(err){
        console.log(err.message)
        return false
        }
}