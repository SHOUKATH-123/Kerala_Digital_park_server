import mongoose from "mongoose";


class OrderUseCase {
    #orderRepositories;
    constructor(orderRepositories) {
        this.#orderRepositories = orderRepositories;
    }
    async createOrder(orderData, userId) {
        try {
            if(!orderData || !orderData.products || orderData.products.length <= 0) {
                throw {
                    status: 400,
                    message: 'Invalid order data. Please provide valid products.'
                };
            }
           
            const validatedProducts = orderData.products.map(item => {
                let { productId, quantity } = item;

                // Validate productId
                const isValidId = mongoose.Types.ObjectId.isValid(productId);
                if (!isValidId) {
                    throw {
                        status: 400,
                        message: `Invalid productId: ${productId}`
                    };
                }

                // Validate quantity
                quantity = parseInt(quantity)||1;

                return { productId, quantity };
            });

            const newOrder= await this.#orderRepositories.createOrder(validatedProducts,userId)
            
            return{
                status: 200,
                message: 'Order created successfully',
                data: newOrder
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while creating the order.'
            };
        }
    }


}

export default OrderUseCase;