import { Router } from 'express';
import * as timeoffController from '../controllers/timeoffController'
import withAuth from '../utils/authenticationMiddleWare.js';
// import withAuth from '../utils/authenticationMiddleWare.js';

const router = Router();

router.get('/mytimeoffdetails',withAuth,timeoffController.getTimeOffDetails)

router.get('/mytimeoffrequests',withAuth,timeoffController.getMyTimeOffRequests)
router.post('/timeoffrequest',withAuth,timeoffController.processTimeOffRequest)
export default router;