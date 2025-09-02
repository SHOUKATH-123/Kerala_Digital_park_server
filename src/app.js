import express from 'express'

const mainRouter=express.Router();
//userRouters
import userRouter from './presentation/routes/user/userRoutes.js';
import homeRouter from './presentation/routes/user/homeRouter.js';
import orderRouter from './presentation/routes/user/orderRoutes.js';
import addressRouter from './presentation/routes/user/addressRouter.js';
import reviewRouter from './presentation/routes/user/reviewRouter.js';
import productAndAlienation from './presentation/routes/user/productAndAlienation.js'

//adminRouters
import adminRouter from './presentation/routes/admin/adminRouter.js'
import adminCategoryRouter from './presentation/routes/admin/adminCategoryRouter.js'
import adminProductRouter from './presentation/routes/admin/adminProductRouter.js'
import adminOrderRouter from './presentation/routes/admin/adminOrderRouter.js';
import adminCouponRouter from './presentation/routes/admin/adminCouponRouter.js';
import adminDataRouter from './presentation/routes/admin/adminDataRouter.js';

// ✅ user Route handlers
mainRouter.use('/user',userRouter); 
mainRouter.use('/',homeRouter);
mainRouter.use('/order',orderRouter);
mainRouter.use('/address',addressRouter);
mainRouter.use('/review',reviewRouter);
mainRouter.use('/product',productAndAlienation);

// ✅ admin Route handlers
mainRouter.use('/admin',adminRouter);
mainRouter.use('/admin',adminCategoryRouter);
mainRouter.use('/admin',adminProductRouter);
mainRouter.use('/admin',adminOrderRouter);
mainRouter.use('/admin',adminCouponRouter);
mainRouter.use('/admin',adminDataRouter)



mainRouter.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ status, message });
});

export default mainRouter