import db from '../models/index.js' // models path depend on your structure
import { ReCD, ReE, ReS } from '../utils/response.js';
import jwt from 'jsonwebtoken'
import { calculateTotalDays, getRequestsTimeOff, getRequestsTimeOffOfAllEmployeesForManager } from '../utils/timeOffUtils.js';
import moment from 'moment'
import { hasEnoughBalanceAuto, hasEnoughBalanceManual, isPeakTime, processAutomaticVacationTimeOffRequest } from '../utils/requestTimeOffUtils.js';
import { s } from '../utils/automatedLeave.js';
const _timeOffRequest = db.models.requesttimeoff;
const _timeoff = db.models.timeoff
const _employee = db.models.employee

const getTimeOffDetails = async (req, res) => {
    const { id } = req

    //Find loginCredentials
    const timeOffDetails = await _timeoff.findByPk(id);
    // if no timeoff details found 
    if (!timeOffDetails) return ReE(res, "Could not find record in database", null, 404)

    return ReS(res, "Found TimeOffDetails", timeOffDetails, 200)
};

const getMyTimeOffRequests = async (req, res) => {
    const { id } = req

    return ReS(res, "Found TimeOffRequests of the employee", await getRequestsTimeOff(id), 200)
}

const getTimeOffRequestsOfEmployee = async (req, res) => {
    const { employee_id } = req
    return ReS(res, "Found TimeOffRequests of the employee", getRequestsTimeOff(employee_id), 200)
}

const getTimeOffRequestsOfEmployeesForAManager = async (req, res) => {
    const { id } = req
    const allEmployeesRequest = getRequestsTimeOffOfAllEmployeesForManager(id)
    return ReS(res, "TimeOffRequests Of All Employees Of A manager", allEmployeesRequest, 200)
}

const processTimeOffRequest = async (req, res) => {
    const { id } = req
    const profile = await _employee.findByPk(id)
    let { startDate, endDate, type_id, reason } = req.body
    startDate = moment(startDate)
    endDate = moment(endDate)

    // TODO check if this is neccasssary 

    const existing = await _timeOffRequest.findAll({ where: { employee_id: id } })
    if (existing.filter(r => startDate.isBetween(r.startDate, r.endDate) || endDate.isBetween(r.startDate, r.endDate) || (startDate == r.startDate && endDate == r.endDate)).length) {
        return ReE(res, "Some of days already taken by you, please give correct dates", null, 400)
    }
    // TODO Check if holiday in range 
    const totalDays = calculateTotalDays(startDate, endDate)
    if(totalDays==0) return ReE(res,"Either there are no days which are not already holidays or the range is incorrect",null,400)
    let timeOffDetails = await _timeoff.findByPk(id)
    if ([2, 3, 4].includes(parseInt(type_id))) {
        // manual process
        if ([1, 2, 3, 4].includes(profile.role_id)) {
            // no need approval because either president,head,deputy or manager

            const r = await hasEnoughBalanceManual(timeOffDetails, type_id, totalDays)
            const hasBalance = r.done
            timeOffDetails = r.timeOffDetails
            if (!hasBalance)
                return ReE(res, "You dont have enough balance for this type",
                    { request: null, timeOffDetails }, 400)
            const request = await _timeOffRequest.create({
                employee_id: id, leave_id: type_id, approver_id: null, status_id: 6
                , startDate, endDate, totalDays, requestReason: reason, peaktime_flag: isPeakTime(startDate, endDate) ? 'T' : 'F'
            },{include:'leave'})
            return ReS(res, "Leave Request Has Been Accepted and Recorded", { timeOffDetails, request }, 200)
        } else {
            // request made but waiting for approval from manager
            const r = await hasEnoughBalanceManual(timeOffDetails, type_id, totalDays)
            const hasBalance = r.done
            timeOffDetails = r.timeOffDetails
             if (!hasBalance)
                return ReE(res, "You dont have enough balance for this type",
                    { request: null, timeOffDetails }, 400)
            const request = await _timeOffRequest.create({
                employee_id: id, leave_id: type_id, approver_id: profile.manager_id, status_id: 1
                , startDate, endDate, totalDays, requestReason: reason, peaktime_flag: isPeakTime(startDate, endDate) ? 'T' : 'F'
            },{include:'leave'})
            return ReS(res, "Leave Request Has Been Recorded and Awaiting Manager Approval", { request, timeOffDetails }, 200)
        }

    } else {
        // automatic approval for vacation type

        if (!hasEnoughBalanceAuto(totalDays, timeOffDetails))
            return ReE(res, "You dont have enough vacation balance", { timeOffDetails, request: null }, 400)

        const christmasStart = moment(`${startDate.year()}-12-24`)
        const christmasEnd = moment(`${startDate.year() + 1}-01-02`)
        if ((christmasEnd == endDate && christmasStart == startDate) || (startDate.isBetween(christmasStart, christmasEnd) && endDate.isBetween(christmasStart, christmasEnd))) {
            // const christmas = { start, end }
            const request = await _timeOffRequest.create({
                employee_id: id, leave_id: type_id, approver_id: null, status_id: 6
                , startDate, endDate, totalDays, requestReason: reason, peaktime_flag: isPeakTime(startDate, endDate) ? 'T' : 'F'
            },{include:'leave'})
            timeOffDetails = await timeOffDetails.decrement('vacationBalance', { by: totalDays })
            timeOffDetails =await timeOffDetails.increment('vacationUsed', { by: totalDays })
            return ReS(res, "Leave Request Has Been Accepted and Recorded", { timeOffDetails, request }, 200)
        } else {
            const response = await s(startDate, endDate, totalDays, false, id)
            if (response.alternate) {
                // alternate dates provided 
                return ReS(res, "Alternate Dates Provided", { timeOffDetails, request: null, alternate: { ...response } }, 200)
            }
            else {
                const request = await _timeOffRequest.create({
                    employee_id: id, leave_id: type_id, approver_id: null, status_id: 6
                    , startDate, endDate, totalDays, requestReason: reason, peaktime_flag: isPeakTime(startDate, endDate) ? 'T' : 'F'
                },{include:['leave']})
                timeOffDetails =await timeOffDetails.decrement('vacationBalance', { by: totalDays })
                timeOffDetails =await timeOffDetails.increment('vacationUsed', { by: totalDays })
                return ReS(res, "Leave Request Has Been Accepted and Recorded", { timeOffDetails, request }, 200)
            }
        }


    }
}
export {
    getTimeOffDetails,
    getMyTimeOffRequests,
    getTimeOffRequestsOfEmployee,
    getTimeOffRequestsOfEmployeesForAManager,
    processTimeOffRequest
}