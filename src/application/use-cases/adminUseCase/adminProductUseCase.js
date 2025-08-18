import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import AwsS3Bucket from '../../../domain/services/awsS3Bucket.js';

const awsS3Bucket = new AwsS3Bucket()


class AdminProductUseCase {
    #adminProductRepositories
    #awsS3Bucket
    constructor(adminProductRepositories, awsS3Bucket) {
        this.#adminProductRepositories = adminProductRepositories
        this.#awsS3Bucket = awsS3Bucket
    }
    async addNewProduct(productData, images) {
        try {
            
            const checkCategory = await this.#adminProductRepositories.checkCategory(productData.category);
            if (!checkCategory) {
                images.forEach((file) => {
                    const filePath = path.resolve(file.path);
                    fs.unlink(filePath, () => { });
                });

                throw {
                    message: 'This Category is not Exists.',
                    status: 400
                };
            }
            
            await this.#adminProductRepositories.checkNameExists(productData.name);

            const imagesUrl = await this.#awsS3Bucket.storeImages(images);
            // console.log(imagesUrl);
            
            const addedProductData = await this.#adminProductRepositories.addNewProduct(productData, imagesUrl);
            
            return { status: 200, data: addedProductData, message: 'Product added successfully.', }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in add Product. in UseCase'
            };
        }
    }
    async takeAllProduct(reqData) {
        try {
            const { limit, page,stock } = reqData
            const productsData = await this.#adminProductRepositories.takeAllProduct(limit, page,stock);
            return productsData;
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in take all products. in UseCase'
            };
        }
    }
    async updateListing(reqData) {
        try {
            const { id, list } = reqData
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw { status: 400, message: 'Invalid MongoDB ID format' };
            }
            const updatedProduct = await this.#adminProductRepositories.updateListing(id, list);
            return { status: 200, message: 'Product listing updated successfully', data: updatedProduct }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in update listing products. in UseCase'
            };
        }
    }
    async deleteProduct(productId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw { status: 400, message: 'Invalid MongoDB ID format' };
            }
            const deleteProductID = await this.#adminProductRepositories.deleteProduct(productId);

            return { status: 200, message: `Product deleted successfully. Deleted product ID: ${deleteProductID}` }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in delete product. in UseCase'
            };
        }
    }
    async updateProductData(updatedData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(updatedData.productId)) {
                throw { status: 400, message: 'Invalid Product ID format' };
            }
            if (!mongoose.Types.ObjectId.isValid(updatedData.category)) {
                throw { status: 400, message: 'Invalid Category ID format' };
            }

            const takeProduct = await this.#adminProductRepositories.takeProductData(updatedData.productId)
            const productObject = takeProduct.toObject();
            productObject.category = takeProduct.category.toString();

            updatedData.price = parseInt(updatedData.price) 
            updatedData.stock = parseInt(updatedData.stock)


            const fieldsToCheck = ['name', 'description', 'subtitle', 'price', 'category', 'stock'];
            let update = false
            let updatedProduct = null
            for (const field of fieldsToCheck) {
                if (updatedData.hasOwnProperty(field)) {
                    if (productObject[field] !== updatedData[field]) {
                        update = true
                        updatedProduct = await this.#adminProductRepositories.updateData(field, updatedData[field], productObject._id);

                    }
                }
            }
            return {
                status: 200,
                message: 'Product updating successfully.',
                updated: update ? true : false,
                data: update ? updatedProduct : takeProduct
            }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in update product. in UseCase'
            };
        }
    }
    async updateProductImage(productData, images) {
        try {
            if (!mongoose.Types.ObjectId.isValid(productData.productId)) {
                throw { status: 400, message: 'Invalid Product ID format' };
            }
            const imageArray = JSON.parse(productData.productImage);

            if ((!Array.isArray(imageArray) || imageArray.length < 1) && images.length < 1) {

                throw {
                    status: 400,
                    message: 'At least one product image must be provided'
                };
            }

            const takeProduct = await this.#adminProductRepositories.takeProductData(productData.productId)
            const productObject = takeProduct.toObject();
            productObject.category = takeProduct.category.toString();


            let update = false
            let updatedData = null

            if (JSON.stringify(productObject.images) !== productData.productImage) {
                updatedData = await this.#adminProductRepositories.imageUpdating(takeProduct._id, imageArray);
                update = true
            }


            if (images.length > 0) {
                const imagesUrl = await this.#awsS3Bucket.storeImages(images);
                if (Array.isArray(imagesUrl) && imagesUrl.length > 0) {
                    updatedData = await this.#adminProductRepositories.pushNewUrl(imagesUrl, takeProduct._id)
                    update = true
                }
            }

            const newImages = imageArray;
            const oldImages = productObject.images;

            const commonImages = oldImages.filter(url => !newImages.includes(url));

            if (commonImages && commonImages.length > 0) {
                for (const imageUrl of commonImages) {
                    await awsS3Bucket.deleteImageFromAwsS3(imageUrl);
                }
            }

            return {
                status: 200,
                message: 'Product updating successfully.',
                updated: update ? true : false,
                data: update ? updatedData.images : takeProduct.images
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in update productImage. in UseCase'
            };
        }
    }
    async takeProductCategory() {
        try {
            const categories = await this.#adminProductRepositories.takeCategory()
            return {
                status: 200,
                message: 'successful.',
                data: categories
            }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in take category data. in UseCase'
            };
        }
    }
    async searchProduct(key) {
        try {
            if (!key) {
                throw {
                    status: 400,
                    message: 'Search key is required.',
                };
            }

            const productData = await this.#adminProductRepositories.searchProduct(key);

            return {
                status:200,
                message:'Product searching successful.',
                data:productData
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in take category data. in UseCase'
            };
        }
    }
    async updateProductDetails(newData){
         try {

            const savedData=await this.#adminProductRepositories.updateProductData(newData)
            //  console.log(savedData);
             
             return {
                status:200,
                message:'Product details update successful.',
                data:savedData
            }

         } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in updateProductDetails category data. in UseCase'
            };
         }
    }
}

export default AdminProductUseCase;