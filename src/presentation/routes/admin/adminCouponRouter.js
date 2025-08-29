import express from 'express';
const couponRouter = express.Router();

import AdminCouponController from '../../controllers/admin/adminCouponController.js';
import AdminCouponUseCase from '../../../application/use-cases/adminUseCase/adminCouponUseCase.js';
import AdminCouponRepository from '../../../domain/repositories/adminRepositories/adminCouponRepository.js';

import AdminAuthentication from '../../middleware/adminMiddleware/adminAuthentication.js';

const adminCouponRepository = new AdminCouponRepository();
const adminCouponUseCase = new AdminCouponUseCase(
    adminCouponRepository
);


const adminCouponController = new AdminCouponController(
    adminCouponUseCase
);

const adminAuthentication=new AdminAuthentication()

couponRouter.post('/create-coupon',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCouponController.createCoupon(req,res,next);
});
couponRouter.get('/coupons',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCouponController.getAllCoupons(req,res,next);
});
couponRouter.delete('/delete-coupon/:couponId',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminCouponController.deleteCoupon(req,res,next);
});
couponRouter.put('/update-coupon/:couponId',(req,res,next)=>{
    adminCouponController.updateCoupon(req,res,next);
});





export default couponRouter;