import express from 'express'
const categoryRouter=express.Router()

import AdminCategoryController from '../../controllers/admin/adminCategoryController.js';
import AdminCategoryUseCase from '../../../application/use-cases/adminUseCase/adminCategoryUseCase.js';
import AdminCategoryRepository from '../../../domain/repositories/adminRepositories/adminCategoryRepository.js';

//middleware
import AdminAuthentication from '../../middleware/adminMiddleware/adminAuthentication.js';

const adminCategoryRepository=new AdminCategoryRepository()

const adminCategoryUseCase=new AdminCategoryUseCase(
      adminCategoryRepository
)

const adminCategoryController=new AdminCategoryController(
    adminCategoryUseCase
)

const adminAuthentication=new AdminAuthentication()

categoryRouter.post('/addCategory',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.addCategory(req,res,next);
})
categoryRouter.get('/category',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.takeAllCategory(req,res,next); 
})
categoryRouter.patch('/category/listing',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.updataListing(req,res,next);
})
categoryRouter.delete('/category/delete/:id',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.deleteCategory(req,res,next); 
}) 
categoryRouter.put('/category/update',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.updateCategory(req,res,next)
})
categoryRouter.get('/category/:search',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.searchCategory(req,res,next);
})
categoryRouter.get('/users',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.getAllUsers(req,res,next);
}) 
categoryRouter.patch('/blockUsers',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.blockUser(req,res,next);
})
categoryRouter.get('/search/:value',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.searchUser(req,res,next);
})
categoryRouter.get('/userData/:id',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCategoryController.takeAllUserData(req,res,next);
})



export default categoryRouter;