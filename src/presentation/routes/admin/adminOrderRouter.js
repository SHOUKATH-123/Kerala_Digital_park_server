import express from 'express';
const adminOrderRouter = express.Router();

import AdminOrderController from '../../controllers/admin/adminOrderController.js';
import AdminOrderUseCase from '../../../application/use-cases/adminUseCase/adminOrderUseCase.js';   
import AdminOrderRepository from '../../../domain/repositories/adminRepositories/adminOrderRepository.js';

import AdminAuthentication from '../../middleware/adminMiddleware/adminAuthentication.js';


const adminOrderRepository = new AdminOrderRepository();

const adminOrderUseCase = new AdminOrderUseCase(
    adminOrderRepository
);
const adminOrderController = new AdminOrderController(
    adminOrderUseCase
);

const adminAuthentication=new AdminAuthentication()


adminOrderRouter.get('/orders',adminAuthentication.verifyAdmin,(req, res, next) => {
    adminOrderController.getAllOrders(req, res, next);
})
adminOrderRouter.put('/order/status',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminOrderController.updateOrderStatus(req,res,next);
});
adminOrderRouter.get('/order/:id',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminOrderController.getOrderById(req,res,next);
});



export default adminOrderRouter;

