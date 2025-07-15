
import express from 'express'
const adminRouter = express.Router()

import AdminController from '../../controllers/admin/adminController.js';
import AdminUseCase from '../../../application/use-cases/adminUseCase/adminUseCase.js';
import AdminRepository from '../../../domain/repositories/adminRepositories/adminRepository.js';

const adminRepository=new AdminRepository()

const adminUseCase=new AdminUseCase(
    adminRepository
)

const adminController=new AdminController(
    adminUseCase
)





export default adminRouter;

