import express from 'express'
const AlienationRouter =express.Router()

import ProductController from '../../controllers/user/productController.js';
import ProductUseCase from '../../../application/use-cases/userUseCase/productUseCase.js';
import ProductRepository from '../../../domain/repositories/userRepositories/productRepository.js';

const productRepository=new ProductRepository()

const productUseCase=new ProductUseCase(
      productRepository
)


const productController= new ProductController(
     productUseCase
);

AlienationRouter.get('/tobBarCategory',(req,res,next)=>{
      productController.takeTobBarCategory(req,res,next)
})
AlienationRouter.get('/productDetails/:id',(req,res,next)=>{
      productController.takeProductDetails(req,res,next)
})



export default AlienationRouter;