import db from '../models/index.js'
import { ReE, ReS } from '../utils/response.js';
const _timeOffRequest = db.models.requesttimeoff;
const _timeoff = db.models.timeoff
const _employee= db.models.employee
export const getProfile = async (req, res) => {
    const { id } = req;
    const profileDetails = await _employee.findByPk(id,{include:['role','department']})
    if(!profileDetails) return ReE(res,"No profile found",null,404)
    return ReS(res,"Profile found",profileDetails,200)


}