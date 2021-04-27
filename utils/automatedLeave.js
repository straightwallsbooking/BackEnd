import { processAutomaticVacationTimeOffRequest } from './requestTimeOffUtils'
import { calculateTotalDays } from './timeOffUtils';
import moment from 'moment'

export const s = async (startDate, endDate, totalDays, alternate = false,id) => {
    if (calculateTotalDays(startDate, endDate) !== totalDays) {
        
        do {
            startDate = startDate.subtract(-1, 'd')
            endDate = endDate.subtract(-1, 'd')
            console.log(startDate,endDate)
        } while (calculateTotalDays(startDate, endDate) > totalDays)
        return s(startDate, endDate, totalDays, alternate,id)
    }
    const christmasStart = moment(`${startDate.year()}-12-24`)
    const christmasEnd = moment(`${startDate.year() + 1}-01-02`)
    let beforechristmas = null;
    let afterchristmas = null;
    // let christmas = null
    if (christmasStart.isBetween(startDate, endDate) && christmasEnd.isBetween(startDate, endDate)) {
        beforechristmas = { start:startDate, end: moment(`${startDate.year()}-12-23`) }
        const response = await processAutomaticVacationTimeOffRequest(beforechristmas.start, beforechristmas.end,  id, totalDays)
        if (response.success) {
            afterchristmas = { start: moment(`${startDate.year() + 1}-01-03`), endDate }
            const response = await processAutomaticVacationTimeOffRequest(afterchristmas.start, afterchristmas.end,  id, totalDays)
            if (response.success) {
                return { alternate, startDate, endDate }
            } else {
                do {
                    startDate = startDate.subtract(-1, 'd'),
                    endDate = endDate.subtract(-1, 'd')
                } while (calculateTotalDays(startDate, endDate) != totalDays)
                return s(startDate, endDate, totalDays, true,id)
            }
        } else {
            do {
                startDate = startDate.subtract(-1, 'd'),
                endDate = endDate.subtract(-1, 'd')
            } while (calculateTotalDays(startDate, endDate) != totalDays)
            return s(startDate, endDate, totalDays, true,id)
        }
        // const halfOfTheStaffAvailable = await isHalfStaffAvailable(beforechristmas.start, beforechristmas.end, employee.department_id, 50)
        // processAutomaticVacationTimeOffRequest(startDate, endDate, reason, id)
        // if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 50% of the Staff Should Be Available" }

        // christmas = { start: christmasStart, end: christmasEnd }

        // if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 40% of the Staff Should Be Available" }

        // halfOfTheStaffAvailable = await isHalfStaffAvailable(afterchristmas.start, afterchristmas.end, employee.department_id, 50)
        // if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 50% of the Staff Should Be Available" }


    } else if (christmasStart.isBetween(startDate, endDate)) {
        beforechristmas = { start:startDate, end: moment(`${startDate.year()}-12-23`) }
        // const halfOfTheStaffAvailable = await isHalfStaffAvailable(beforechristmas.start, beforechristmas.end, employee.department_id, 50)
        // if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 50% of the Staff Should Be Available" }
        const response = await processAutomaticVacationTimeOffRequest(beforechristmas.start, beforechristmas.end,  id, totalDays)
        if (response.success) {
            return { alternate, startDate, endDate }
        } else {
            do {
                startDate = startDate.subtract(-1, 'd'),
                endDate = endDate.subtract(-1, 'd')
            } while (calculateTotalDays(startDate, endDate) != totalDays)
            return s(startDate, endDate, totalDays, true,id)
        }
        // christmas = { start: christmasStart, end }
        // // halfOfTheStaffAvailable = await isHalfStaffAvailable(christmas.start, christmas.end, employee.department_id, 40)
        // if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 40% of the Staff Should Be Available" }

    }
    else if (christmasEnd.isBetween(startDate, endDate)) {
        // christmas = { start, end: christmasEnd }
        // const halfOfTheStaffAvailable = await isHalfStaffAvailable(christmas.start, christmas.end, employee.department_id, 40)
        // if (!halfOfTheStaffAvailable) return { success: false, message: "Atleast 40% of the Staff Should Be Available" }

        afterchristmas = { start: moment(`${startDate.year()+1}-01-03`), end:endDate }
        const response = await processAutomaticVacationTimeOffRequest(afterchristmas.start, afterchristmas.end, id, totalDays)
        if (response.success) {
            return { alternate, startDate, endDate }
        } else {
            do {
                startDate = startDate.subtract(-1, 'd'),
                endDate = endDate.subtract(-1, 'd')
            } while (calculateTotalDays(startDate, endDate) != totalDays)
            return s(startDate, endDate, totalDays, true,id)
        }

    } else {
        const response = await processAutomaticVacationTimeOffRequest(startDate, endDate, id, totalDays)
        if (response.success) {
            return { alternate, startDate, endDate }
        } else {
            do {
                startDate = startDate.subtract(-1, 'd'),
                endDate = endDate.subtract(-1, 'd')
            } while (calculateTotalDays(startDate, endDate) != totalDays)
            return s(startDate, endDate, totalDays, true,id)
        }
    }
}