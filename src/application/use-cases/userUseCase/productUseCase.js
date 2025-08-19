import mongoose from "mongoose";

class ProductUseCase {
    #productRepository
    constructor(productRepository) {
        this.#productRepository = productRepository
    }
    async takeTobBarCategory() {
        try {
            const categoryData = await this.#productRepository.takeCategoryData()

            //   console.log(categoryData); 
            return {
                status: 200,
                data: categoryData,
                message: 'successful.'
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while takeTobBarCategory.'
            };
        }
    }
    async takeProductDetails(productId) {
        try {
          
            const isValidId = mongoose.Types.ObjectId.isValid(productId);
            if (!isValidId) {
                throw {
                    status: 400,
                    message: `Invalid Product Id: ${productId}`
                };
            }

            const productData = await this.#productRepository.takeProductDetails(productId);

            return {
                status:200,
                message:"successful.",
                data:productData
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while take Product Details.'
            };
        }
    }
}

export default ProductUseCase;