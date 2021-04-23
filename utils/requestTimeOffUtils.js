import moment from "moment"

import momentHoliday from 'moment-holiday'

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
    const startEasterPeak = easterDate.subtract(7, 'd').format('YYYY-MM-DD')
    const endEasterPeak = easterDate.subtract(-7, 'd').format('YYYY-MM-DD')
    return { startEasterPeak, endEasterPeak }
}