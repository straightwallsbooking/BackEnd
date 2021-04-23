import { Router } from 'express';
import * as profileController from '../controllers/profileController.js'
import withAuth from '../utils/authenticationMiddleWare.js';
// import withAuth from '../utils/authenticationMiddleWare.js';

const router = Router();

router.get('/',withAuth,profileController.getProfile)

// router.get('/checklogin',withAuth,authController.checkLogin)

export default router;