import express from 'express'

const adminDataRouter=express.Router()

import AdminDataController from '../../controllers/admin/adminDataController.js';
import AdminDataUseCase from '../../../application/use-cases/adminUseCase/adminDataUseCase.js';
import AdminDataRepository from '../../../domain/repositories/adminRepositories/adminDataRepository.js';

import AdminAuthentication from '../../middleware/adminMiddleware/adminAuthentication.js';

const adminDataRepository=new AdminDataRepository();
const adminDataUseCase=new AdminDataUseCase(
    adminDataRepository
);

const adminDataController=new AdminDataController(
   adminDataUseCase
);

const adminAuthentication=new AdminAuthentication();


adminDataRouter.post('/profile-update',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminDataController.updateProfile(req,res,next);
})

adminDataRouter.post('/profile/update-password',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminDataController.updatePassword(req,res,next);
})

adminDataRouter.get('/dashboard-top',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminDataController.getTopData(req,res,next);
})


export default adminDataRouter;