import express from 'express';
const orderRouter = express.Router();

import OrderController from '../../controllers/user/orderController.js';
import OrderUseCase from '../../../application/use-cases/userUseCase/orderUseCase.js';
import OrderRepositories from '../../../domain/repositories/userRepositories/orderRepositories.js';
import UserAuthentication from '../../middleware/userMiddleware/userAuthentication.js';
const userAuthentication = new UserAuthentication();

const orderRepositories = new OrderRepositories();

const orderUseCase = new OrderUseCase(
    orderRepositories
);

const orderController = new OrderController(
    orderUseCase 
);

orderRouter.post('/create', userAuthentication.verifyUser,(req,res,next)=>{
    orderController.createOrder(req, res, next);
});
orderRouter.post('/verifyOrder', userAuthentication.verifyUser,(req,res,next)=>{
    orderController.verifyOrder(req, res, next);
});

export default orderRouter;