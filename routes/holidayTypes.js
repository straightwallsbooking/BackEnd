import { Router } from 'express';
import * as holidayTypesController from '../controllers/holidayTypesController.js'
import withAuth from '../utils/authenticationMiddleWare.js';
// import withAuth from '../utils/authenticationMiddleWare.js';

const router = Router();

router.get('/',withAuth,holidayTypesController.getAllHolidayTypes)

// router.get('/checklogin',withAuth,authController.checkLogin)

export default router;