 
import express from 'express';
const addressRouter = express.Router();

import AddressController from '../../controllers/user/addressControllers.js';
import AddressUseCase from '../../../application/use-cases/userUseCase/addressUseCase.js';
import AddressRepository from '../../../domain/repositories/userRepositories/addressRepository.js';

import UserAuthentication from '../../middleware/userMiddleware/userAuthentication.js';
const userAuthentication = new UserAuthentication();

const addressRepository = new AddressRepository();

const addressUseCase = new AddressUseCase(
    addressRepository
);

const addressController = new AddressController(
    addressUseCase
);

addressRouter.post('/add', userAuthentication.verifyUser,(req,res,next)=>{
    addressController.addAddress(req, res, next);
});
addressRouter.get('/addresses', userAuthentication.verifyUser, (req, res, next) => {
    addressController.getAddresses(req, res, next);
});
addressRouter.delete('/delete/:id', userAuthentication.verifyUser, (req, res, next) => {
    addressController.deleteAddress(req, res, next);
});

export default addressRouter;