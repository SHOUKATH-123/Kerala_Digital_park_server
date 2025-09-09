import express from 'express';
const orderRouter = express.Router();

import OrderController from '../../controllers/user/orderController.js';
import OrderUseCase from '../../../application/use-cases/userUseCase/orderUseCase.js';
import OrderRepositories from '../../../domain/repositories/userRepositories/orderRepositories.js';


import UserAuthentication from '../../middleware/userMiddleware/userAuthentication.js';


import upload from '../../middleware/adminMiddleware/productImageStoring.js' 


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
orderRouter.post('/create-payment-intent',userAuthentication.verifyUser,(req,res,next)=>{
    orderController.createPayment(req,res,next)
})
orderRouter.post('/add-Address',userAuthentication.verifyUser,(req,res,next)=>{
    orderController.addAddress(req,res,next);
})
orderRouter.put('/apply-coupon',userAuthentication.verifyUser,(req,res,next)=>{
    orderController.ApplyCoupon(req,res,next);
})
orderRouter.post('/custom-data',userAuthentication.verifyUser,upload.array('images',10),(req,res,next)=>{
    orderController.addCustomData(req,res,next);
})
orderRouter.get("/all",userAuthentication.verifyUser,(req,res,next)=>{
    orderController.takeAllOrders(req,res,next);
})
orderRouter.put("/:orderId/pay",userAuthentication.verifyUser,(req,res,next)=>{
     orderController.savePaymentResult(req,res,next);
})

export default orderRouter;