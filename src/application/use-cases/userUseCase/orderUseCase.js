import mongoose from "mongoose";
import Stripe from "stripe";
import config from '../../../config/env.js'



const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});


class OrderUseCase { 
    #orderRepositories;
    constructor(orderRepositories) {
        this.#orderRepositories = orderRepositories;
    }
    async createOrder(orderData, userId) {
        try {
            if (!orderData || !orderData.products || orderData.products.length <= 0) {
                throw {
                    status: 400,
                    message: 'Invalid order data. Please provide valid products.'
                };
            }

            const validatedProducts = orderData.products.map(item => {
                let { productId, quantity, size, paper, finish, corner } = item;

                // Validate productId
                const isValidId = mongoose.Types.ObjectId.isValid(productId);
                if (!isValidId) {
                    throw {
                        status: 400, 
                        message: `Invalid productId: ${productId}`
                    };
                }

                // Validate quantity 
                quantity = parseInt(quantity) || 1;

                return { productId, quantity, size, paper, finish, corner };
            });

            const newOrder = await this.#orderRepositories.createOrder(validatedProducts, userId)

            return {
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
    async createPayment(orderData) {
        try {

            const orderId = orderData.order?.orderId
            const isValidId = mongoose.Types.ObjectId.isValid(orderId);
            if (!isValidId) {
                throw {
                    status: 400,
                    message: `Invalid Order Id: ${orderId}`
                };
            }
             const orderDbData = await this.#orderRepositories.takeOrderData(orderId);
            
            const paymentMethodMap = {
                card: "card",
                paypal: "paypal",
                klarna: "klarna",
                afterpay: "afterpay_clearpay",
                cashapp: "cashapp",
            };

            const selectedMethod = paymentMethodMap[orderData.selectedPaymentMethod];
            if (!selectedMethod) {
                throw {
                    status: 400,
                    message: `Invalid payment method: ${orderData.selectedPaymentMethod}`
                };
            };


            const amount = orderDbData.totalPrice
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'nzd',
                payment_method_types: [selectedMethod] 
            });

        
            return {
                status: 200,
                message: 'Payment created successfully',
                data: paymentIntent
            }


        } catch (error) {
            
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while creating the Payment.'
            };
        }
    }


}

export default OrderUseCase;