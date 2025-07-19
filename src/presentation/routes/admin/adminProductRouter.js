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
    // console.log('worked');
    
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




// import Review from '../../../infrastructure/database/models/productReview.js';
// import Product from '../../../infrastructure/database/models/productModel.js';
// productRouter.post('/addReview',async (req,res,next)=>{
//     req.body.rating=parseInt(req.body.rating)
//     const {user,rating,comment,product}=req.body
//     // rating=parseInt(rating)
//     console.log(req.body);

//     const newReview = await Review.create({ user, rating: rating, comment });
//     const productData = await Product.findById(product);
//     if (!productData) {
//       return res.status(404).json({ message: 'Product not found.' });
//     }

//     // Add the new review ID to product.reviews
//     productData.reviews.push(newReview._id);

//     const newRating={
//           count :productData.rating.count+1,
//           total :productData.rating.total+newReview.rating,
//     }
//     // Update rating count and total
//     productData.rating = newRating
   

//     // Save product
//     await productData.save();
//     return res.status(200).json('success')
    
// })


export default productRouter