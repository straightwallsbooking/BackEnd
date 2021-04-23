import db from '../models/index.js'
import { ReE, ReS } from '../utils/response.js';
const _leave = db.models.leave
export const getAllHolidayTypes = async (req, res) => {

    const leaveTypes = await _leave.findAll()
    if(!leaveTypes) return ReE(res,"No leave types found",null,404)
    return ReS(res,"Leave types found",leaveTypes,200)


}