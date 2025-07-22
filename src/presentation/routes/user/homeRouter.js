import express from 'express'
const homeRouter = express.Router()

import HomeController from '../../controllers/user/homeController.js';
import HomeUseCase from '../../../application/use-cases/userUseCase/homeUseCase.js';
import HomeRepository from '../../../domain/repositories/userRepositories/homeRepository.js';
import UserAuthentication from '../../middleware/userMiddleware/userAuthentication.js';
const userAuthentication = new UserAuthentication();

const homeRepository=new HomeRepository();
const homeUseCase = new HomeUseCase(
    homeRepository 
);

const homeController = new HomeController(
    homeUseCase
);

homeRouter.get('/products',(req,res,next)=>{
    homeController.takeAllProduct(req,res,next);
});
homeRouter.post('/addToCart',userAuthentication.verifyUser,(req,res,next)=>{
    homeController.addToCard(req,res,next);
});
homeRouter.get('/getCart', userAuthentication.verifyUser, (req, res, next) => {
    homeController.takeCartData(req, res, next);
});
homeRouter.patch('/updateCartQuantity',userAuthentication.verifyUser,(req,res,next)=>{
    homeController.updateCartQuantity(req,res,next);
});
homeRouter.delete('/removeCartItem', userAuthentication.verifyUser, (req, res, next) => {
    homeController.removeCartItem(req, res, next);
});
homeRouter.post('/addToWishlist', userAuthentication.verifyUser, (req, res, next) => {
    homeController.addToWishlist(req, res, next);
});
homeRouter.get('/getWishlist', userAuthentication.verifyUser, (req, res, next) => {
    homeController.takeWishlistData(req, res, next);
});
homeRouter.delete('/removeWishlistItem', userAuthentication.verifyUser, (req, res, next) => {
    homeController.removeWishlistItem(req, res, next);
});

export default homeRouter;