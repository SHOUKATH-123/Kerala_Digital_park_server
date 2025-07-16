
import express from 'express'
const adminRouter = express.Router() 

import AdminController from '../../controllers/admin/adminController.js';
import AdminUseCase from '../../../application/use-cases/adminUseCase/adminUseCase.js';
import AdminRepository from '../../../domain/repositories/adminRepositories/adminRepository.js';
import AdminJwtToken from '../../../domain/services/aminJwtToken.js';

const adminRepository=new AdminRepository()

const adminUseCase=new AdminUseCase(
    adminRepository
)

const adminJwtToken=new AdminJwtToken()
const adminController=new AdminController(
    adminUseCase,
    adminJwtToken
)

adminRouter.post('/login',(req,res,next)=>{
    adminController.login(req,res,next);
})
adminRouter.post('/logout',(req,res,next)=>{
    adminController.logout(req,res,next);
})



export default adminRouter;

