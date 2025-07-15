import express from 'express'

const mainRouter=express.Router();

import userRouter from './presentation/routes/user/userRoutes.js';
import adminRouter from './presentation/routes/admin/adminRouter.js'

// ✅ Route handlers
mainRouter.use('/user',userRouter);
mainRouter.use('/admin',adminRouter);


mainRouter.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ status, message });
});




export default mainRouter