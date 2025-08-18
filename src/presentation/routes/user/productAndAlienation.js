import express from 'express'
const Alienation =express.Router()

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



export default Alienation;