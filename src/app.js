import express from 'express'

const mainRouter=express.Router();

import userRouter from './presentation/routes/user/userRoutes.js';
import homeRouter from './presentation/routes/user/homeRouter.js';
import orderRouter from './presentation/routes/user/orderRoutes.js';

//adminRouters
import adminRouter from './presentation/routes/admin/adminRouter.js'
import adminCategoryRouter from './presentation/routes/admin/adminCategoryRouter.js'
import adminProductRouter from './presentation/routes/admin/adminProductRouter.js'

// ✅ Route handlers
mainRouter.use('/user',userRouter);
mainRouter.use('/',homeRouter);
mainRouter.use('/order',orderRouter);


mainRouter.use('/admin',adminRouter);
mainRouter.use('/admin',adminCategoryRouter);
mainRouter.use('/admin',adminProductRouter);



mainRouter.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ status, message });
});

export default mainRouter