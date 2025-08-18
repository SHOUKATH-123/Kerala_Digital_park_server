
import express from 'express'

const reviewRouter=express.Router()

import ReviewController from '../../controllers/user/reviewControllers.js'
import ReviewUseCase from '../../../application/use-cases/userUseCase/reviewUseCase.js'
import ReviewRepository from '../../../domain/repositories/userRepositories/reviewRepository.js'

import UserAuthentication from '../../middleware/userMiddleware/userAuthentication.js';
const userAuthentication = new UserAuthentication();

const reviewRepository=new ReviewRepository()

const reviewUseCase=new ReviewUseCase(
      reviewRepository
)

const reviewControllers=new ReviewController(
    reviewUseCase
)

reviewRouter.post('/',userAuthentication.verifyUser,(req,res,next)=>{
    reviewControllers.addNewReview(req,res,next);
})
reviewRouter.get('/productReview',userAuthentication.verifyUser,(req,res,next)=>{
    reviewControllers.takeProductReview(req,res,next);
})
reviewRouter.put('/deleteReview/:id',userAuthentication.verifyUser,(req,res,next)=>{
    reviewControllers.deleteReview(req,res,next);
})


export default reviewRouter