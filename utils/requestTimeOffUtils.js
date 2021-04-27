import moment from "moment"
import db from '../models/index.js'
import momentHoliday from 'moment-holiday'
// import employee from "../models/employee.js";
import { Op } from 'sequelize'

const _timeOffRequest = db.models.requesttimeoff;
const _timeoff = db.models.timeoff
const _employee = db.models.employee

export const isPeakTime = (start, end) => {
    const peakStart1 = moment(`${start.year()}-07-15`)
    const peakEnd1 = moment(`${end.year()}-08-31`)
    const peakStart2 = moment(`${start.year()}-12-15`)
    const peakEnd2 = moment(`${end.year()}-12-22`)
    const { startEasterPeak, endEasterPeak } = weekBeforeAndAfterEasterRange()
    if (start.isBetween(peakStart1, peakEnd1) || end.isBetween(peakStart1, peakEnd1) ||
        start.isBetween(peakStart2, peakEnd2) || end.isBetween(peakStart2, peakEnd2)
        || start.isBetween(startEasterPeak, endEasterPeak) || end.isBetween(startEasterPeak, endEasterPeak)
    ) {
        // Is peak time
        return true
    }
    return false

}

export const weekBeforeAndAfterEasterRange = () => {
    const easterDate = momentHoliday().holiday('Easter Sunday')
    const startEasterPeak = easterDate.subtract(7, 'd')
    // adding 8 days because Easter Monday is also holiday after Easter Sunday 
    const endEasterPeak = easterDate.subtract(-8, 'd')
    return { startEasterPeak, endEasterPeak }
}


export const processAutomaticVacationTimeOffRequest = async (start, end, id, totalDays) => {
    const augustStart = moment(`${start.year()}-08-01`)
    const augustEnd = moment(`${start.year()}-08-31`)
    let beforeAug = null;
    let afterAug = null;
    let aug = null
    const employee = await _employee.findByPk(id)
    if (augustStart.isBetween(start, end) && augustEnd.isBetween(start, end)) {
        // devide into three 1) start part which is not in august 2) middle part which is whole august 3) end part after august
        //Check if 50% or 40%(in case of august) of Staff will be available after this request of not
        beforeAug = { start, end: moment(`${start.year()}-07-31`) }
        const halfOfTheStaffAvailable = await isHalfStaffAvailable(beforeAug.start, beforeAug.end, employee.department_id, 50)
        if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 50% of the Staff Should Be Available" }

        aug = { start: augustStart, end: augustEnd }
        halfOfTheStaffAvailable = await isHalfStaffAvailable(aug.start, aug.end, employee.department_id, 40)
        if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 40% of the Staff Should Be Available in Agust" }

        afterAug = { start: moment(`${start.year()}-09-1`), end }
        halfOfTheStaffAvailable = await isHalfStaffAvailable(afterAug.start, afterAug.end, employee.department_id, 50)
        if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 50% of the Staff Should Be Available" }


    } else if (augustStart.isBetween(start, end)) {
        // devide into two parts 1) before august part 2) august part
        //Check if 50% or 40%(in case of august) of Staff will be available after this request of not
        beforeAug = { start, end: moment(`${start.year()}-07-31`) }
        const halfOfTheStaffAvailable = await isHalfStaffAvailable(beforeAug.start, beforeAug.end, employee.department_id, 50)
        if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 50% of the Staff Should Be Available" }

        aug = { start: augustStart, end }
        halfOfTheStaffAvailable = await isHalfStaffAvailable(aug.start, aug.end, employee.department_id, 40)
        if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 40% of the Staff Should Be Available in Agust" }

    }
    else if (augustEnd.isBetween(start, end)) {
        // device into two parts 1) august part 2) after august part
        //Check if 50% or 40%(in case of august) of Staff will be available after this request of not
        return { success: false, message: "Atleast 40% of the Staff Should Be Available in Agust" }
        // aug = { start, end: augustEnd }
        // const halfOfTheStaffAvailable = await isHalfStaffAvailable(aug.start, aug.end, employee.department_id, 40)
        // if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 40% of the Staff Should Be Available in Agust" }

        // afterAug = { start: moment(`${start.year()}-09-1`), end }
        // halfOfTheStaffAvailable = await isHalfStaffAvailable(afterAug.start, afterAug.end, employee.department_id, 50)
        // if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 50% of the Staff Should Be Available" }


    } else if ((augustEnd == end && augustStart == start) || (start.isBetween(augustStart, augustEnd) && end.isBetween(augustStart, augustEnd))) {
        // Means whole month of august
        //Check if 50% or 40%(in case of august) of Staff will be available after this request of not
        const aug = { start, end }
        const halfOfTheStaffAvailable = await isHalfStaffAvailable(aug.start, aug.end, employee.department_id, 40)
        if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 40% of the Staff Should Be Available in Agust" }

    } else {
        //Check if 50% or 40%(in case of august) of Staff will be available after this request of not
        const halfOfTheStaffAvailable = await isHalfStaffAvailable(start, end, employee.department_id, 50)
        if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 50% of the Staff Should Be Available" }

    }

    if ([2, 3].includes(employee.role_id)) {
        // head or deputy asking for leave

        //Check if Head and Deputy are on the leave at the same time if this leave is approved 
        let headAndDeputyConstraintConflict = await headOrDeputyPresentAfterApproval(start, end, employee.department_id, employee.role_id == 2 ? 3 : 2)
        if (headAndDeputyConstraintConflict) return { success: false, message: "Head And Deputy Head Can Not Be On Leave At The Same Time" }



    } else if ([4, 5].includes(employee.role_id)) {
        // Manager or Senior Staff asking for Leave
        let atleastOneManagerAndSeniorStaffConstraintFullfilled = await isAtleastOneManagerAndSeniorAvailable(start, end, employee.department_id, employee.role_id)
        if (!atleastOneManagerAndSeniorStaffConstraintFullfilled) return { success: false, message: "Atleast One Employee of Your Role Should Be Present" }
    }
    return { success: true, message: 'Leave Can Be Accepted' }



}

export const hasEnoughBalanceAuto = (totalDays, timeOffDetails) => {
    if (timeOffDetails.vacationBalance < totalDays) return false
    return true
}

const isHalfStaffAvailable = async (start, end, department_id, pct) => {
    const thisDepartmentsStaffRequests = await _timeOffRequest.findAll(
        {
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: start.toDate() } },
                            { endDate: { [Op.gte]: start.toDate() } }
                        ]
                    },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: end.toDate() } },
                            { endDate: { [Op.gte]: end.toDate() } }
                        ]
                    }
                ]
            }, include: [{ model: _employee, where: { department_id }, as: 'employee' }]
        }
    )
    const numberOfStaffOnLeave = [...new Set(thisDepartmentsStaffRequests.map(
        (req) => req.employee_id))].length
    const totalStaff = await _employee.findAndCountAll(
        {
            where: { department_id }
        }
    )
    const percentageDivide = 100 / pct
    if (numberOfStaffOnLeave + 1 > totalStaff / percentageDivide) return false
    return true
}

const isAtleastOneManagerAndSeniorAvailable = async (start, end, department_id, role_id) => {
    // if (role_id)
    const thisDepartmentsThisRoleStaffRequests = await _timeOffRequest.findAll(
        {
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: start.toDate() } },
                            { endDate: { [Op.gte]: start.toDate() } }
                        ]
                    },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: end.toDate() } },
                            { endDate: { [Op.gte]: end.toDate() } }
                        ]
                    }
                ]
            },
            include: [{ model: _employee, where: { role_id, department_id }, as: 'employee' }]
        }
    )
    const numberOfThisRoleStaffOnLeave = [...new Set(thisDepartmentsThisRoleStaffRequests.map(
        (req) => req.employee_id))].length
    const totalThisRoleStaff = await _employee.findAndCountAll(
        {
            where: { department_id, role_id }
        }
    )
    if (numberOfThisRoleStaffOnLeave + 1 >= totalThisRoleStaff) return false
    return true
}

export const headOrDeputyPresentAfterApproval = async (start, end, department_id, otherHead_role_id) => {
    const otherHead = await _employee.findOne({ where: { department_id, role_id: otherHead_role_id } })
    const headRequests = await _timeOffRequest.findAll({ where: { employee_id: otherHead.id } })
    const headLeaveAtTheSameTime = headRequests.filter(r => {
        return ((start.isBetween(moment(r.startDate), moment(r.endDate)) || end.isBetween(moment(r.startDate), moment(r.endDate)))
            || (start.format('YYYY-MM-DD') == r.startDate || end.format('YYYY-MM-DD') == r.endDate)
            || (moment(r.startDate).isBetween(start, end) || moment(r.endDate).isBetween(start, end))
        )
    }).length
    return headLeaveAtTheSameTime
}

export const hasEnoughBalanceManual = async (timeOffDetails, type_id, totalDays) => {
    let newT=timeOffDetails
    switch (parseInt(type_id)) {
        case 2:
            //casual
            if (timeOffDetails.casualBalance < totalDays) {
                return {done:false,timeOffDetails:newT}
            }
            newT= await timeOffDetails.decrement('casualBalance', { by: totalDays })
            break;
        case 3:
            //sick
            if (timeOffDetails.sickBalance < totalDays) {
                return {done:false,timeOffDetails:newT}
            }
            newT= await timeOffDetails.decrement('sickBalance', { by: totalDays })
            break;
        case 4:
            newT= await timeOffDetails.increment('unpaidUsed', { by: totalDays })
            //unpaid
            break;
        default:
            break;
    }
    return {done:true,timeOffDetails:newT}
}
