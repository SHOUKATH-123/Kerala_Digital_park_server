import express from 'express'
const productRouter = express.Router();
import upload from '../../middleware/adminMiddleware/productImageStoring.js' 


import AdminProductController from '../../controllers/admin/adminProductController.js';
import AdminProductRepositories from '../../../domain/repositories/adminRepositories/adminProductRepositories.js';
import AdminProductUseCase from '../../../application/use-cases/adminUseCase/adminProductUseCase.js';


//middleware
import AdminAuthentication from '../../middleware/adminMiddleware/adminAuthentication.js';

//service
import AwsS3Bucket from '../../../domain/services/awsS3Bucket.js';

const awsS3Bucket=new AwsS3Bucket()

const adminProductRepositories = new AdminProductRepositories()
const adminProductUseCase = new AdminProductUseCase(
    adminProductRepositories,
    //service
    awsS3Bucket
)
const adminProductController = new AdminProductController( 
    adminProductUseCase 
)
const adminAuthentication = new AdminAuthentication() 


productRouter.post('/addProduct',adminAuthentication.verifyAdmin, upload.array('images',10),(req,res,next)=>{
    adminProductController.addNewProduct(req, res, next); 
});
productRouter.get('/products',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminProductController.allProducts(req, res, next); 
});
productRouter.patch('/product/listing',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminProductController.updateListing(req,res,next);
})
productRouter.delete('/product/delete/:id',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminProductController.deleteProduct(req,res,next);
})
productRouter.put('/product/update',adminAuthentication.verifyAdmin ,(req,res,next)=>{
    adminProductController.updateProductData(req,res,next);
})
productRouter.put('/product/updateImage',adminAuthentication.verifyAdmin, upload.array('images',10),(req,res,next)=>{
    adminProductController.updateProductImage(req,res,next);
})
productRouter.get('/productCategory',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminProductController.takeProductCategory(req,res,next)
})
productRouter.get('/product/search/:value',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminProductController.searchProduct(req,res,next);
})
productRouter.patch('/product/updataDetails',adminAuthentication.verifyAdmin,(req,res,next)=>{
    adminProductController.updateDetails(req,res,next);  
})

export default productRouter