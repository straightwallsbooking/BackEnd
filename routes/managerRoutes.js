import { Router } from 'express';
import * as managersController from '../controllers/managersController'
import withAuth from '../utils/authenticationMiddleWare.js';

const router = Router();

router.get('/my-employee-timeoff-requests',withAuth,managersController.getMyEmployeesRequests)
router.post('/specific-employee-timeoff-requests',withAuth,managersController.getSpecificEmployeeRequests)
router.get('/my-employees',withAuth,managersController.getMyEmployees)
router.post('/accept-request',withAuth,managersController.acceptRequest)
router.post('/reject-request',withAuth,managersController.rejectRequest)
router.post('/my-employees-status-on-date',withAuth,managersController.getEmployeesStatusOnDate)
// router.get('/checklogin',withAuth,authController.checkLogin)

export default router;