import db from '../models/index.js' // models path depend on your structure
import { ReCD, ReE, ReS } from '../utils/response.js';
import jwt from 'jsonwebtoken'
const _employee = db.models.employee;
const _login = db.models.login



const checkLogin = async (req, res) => {
    return ReS(res, "Authenticated", null, 200);
}
const login = async (req, res) => {
    const { email, password } = req.body
    // Check if email and password are given
    if (!email || !password) return ReE(res, "Please fill all the fields", null, 400)

    //Find loginCredentials
    const creds = await _login.findOne({ where: { email, password } })

    // if no credentials found or wrong credentials given
    if (!creds) return ReE(res, "The credentials provided are incorrect", null, 400)
    const employee = await _employee.findByPk(creds.employee_id)
    if (!employee) return ReE(res, "Couldn't find your profile ", null, 404)
    const userData = {
        id: employee.id,
        email: creds.email,
        name: employee.first_name
    };
    const token = jwt.sign(userData, "Our secret", {
        expiresIn: '5h'
    });
    ReCD(res, 'token'
        , token, true)

    ReS(res, "Logged In", employee, 200)
};
const logout = async (req,res) =>{
    return res.cookie('token', '', { httpOnly:true }).sendStatus(200);
}
export {
    login,
    checkLogin,
    logout
}