import db from '../models/index.js' // models path depend on your structure
import { ReCD, ReE, ReS } from '../utils/response.js';
import jwt from 'jsonwebtoken'
import { getRequestsTimeOff, getRequestsTimeOffOfAllEmployeesForManager } from '../utils/timeOffUtils.js';
import moment from 'moment'
import { isPeakTime } from '../utils/requestTimeOffUtils.js';
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

    const totalDays = startDate.diff(endDate, 'days') + 1
    const timeOffDetails = await _timeoff.findByPk(id)
    if ([2, 3, 4].includes(parseInt(type_id))) {
        // manual process
        if ([1, 2, 3, 4].includes(profile.role_id)) {
            // no need approval because either president,head,deputy or manager
            const request = await _timeOffRequest.create({
                employee_id: id, leave_id: type_id, approver_id: null, status_id: 6
                , startDate, endDate, totalDays, requestReason: reason, peaktime_flag: isPeakTime(startDate, endDate) ? 'T' : 'F'
            })
            switch (parseInt(type_id)) {
                case 2:
                    //casual
                    await timeOffDetails.decrement('casualBalance',{by:1})
                    break;
                case 3:
                    //sick
                    await timeOffDetails.decrement('sickBalance',{by:1})
                    break;
                case 4:
                    await timeOffDetails.increment('unpaidUsed',{by:1})
                    //unpaid
                    break;
                default:
                    break;
            }
            return ReS(res,"Leave Request Has Been Accepted and Recorded",{timeOffDetails,request},200)
        } else {
            // request made but waiting for approval from manager
            const request = await _timeOffRequest.create({
                employee_id: id, leave_id: type_id, approver_id: profile.manager_id, status_id: 1
                , startDate, endDate, totalDays, requestReason: reason, peaktime_flag: isPeakTime(startDate, endDate) ? 'T' : 'F'
            })
            return ReS(res,"Leave Request Has Been Recorded and Awaiting Manager Approval",{request,timeOffDetails},200)
        }

    } else {
        // automatic approval

    }

    // const request = _timeOffRequest.create({
    //     employee_id: id, leave_id: type_id, approver_id: profile.manager_id, status_id: 1
    //     , startDate, endDate, totalDays, requestReason: reason, peaktime_flag: isPeakTime(startDate, endDate) ? 'T' : 'F',
    //     alternateStartDate:???, alternateEndDate:???, alternateAccepted:???,
    //     approvalDueDate:????, approvalReason:????, denialReason:????, approvalTime:????,
    // })
}
export {
    getTimeOffDetails,
    getMyTimeOffRequests,
    getTimeOffRequestsOfEmployee,
    getTimeOffRequestsOfEmployeesForAManager,
    processTimeOffRequest
}