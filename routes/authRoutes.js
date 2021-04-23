import { Router } from 'express';
import * as authController from '../controllers/authControler.js'
import withAuth from '../utils/authenticationMiddleWare.js';

const router = Router();

// router.get('/', ()=>{

// });
router.post('/login',(req,res)=>{
  authController.login(req,res)
})

router.get('/checklogin',withAuth,authController.checkLogin)

router.get('/logout',withAuth,authController.logout)

export default router;