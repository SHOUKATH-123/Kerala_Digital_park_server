
import express from 'express'
const userRouter = express.Router()
import UserController from '../../controllers/user/userController.js';

import UserUseCase from '../../../application/use-cases/userUseCase/userUseCase.js';
import UserRepository from '../../../domain/repositories/userRepositories/userRepository.js';

//service
import SendEmail from '../../../domain/services/sendEmail.js';
import JwtToken from '../../../domain/services/jwtToken.js';

const userRepository = new UserRepository()

//service
const sendEmail = new SendEmail()

const userUseCase = new UserUseCase(
    userRepository,
    //services
    sendEmail
)

const jwtToken = new JwtToken()
const userController = new UserController(
    userUseCase,
    jwtToken
)

userRouter.post('/register', (req, res, next) => {
    userController.saveUserData(req, res, next)
})
userRouter.post('/login', (req, res, next) => {
    userController.login(req, res, next)
})
userRouter.post('/verifyOtp', (req, res, next) => {
    userController.otpVerification(req, res, next);
})
userRouter.post('/sendVerifyOtp', (req, res, next) => {
    userController.sendVerifyOtp(req, res, next);
})
userRouter.get('/forgot-password/:email', (req, res, next) => {
    userController.forgotPassword(req, res, next)
})
userRouter.post('/verifyResetOtp', (req, res, next) => {
    userController.verifyResetOtp(req, res, next)
})
userRouter.post('/setNewPassword', (req, res, next) => {
    userController.setNewPassword(req, res, next)
})
userRouter.post('/logout', (req, res, next) => {
    userController.logout(req, res, next);

})



export default userRouter;
