import mongoose from "mongoose";
import Stripe from "stripe";
import config from '../../../config/env.js'
import fs from "fs";
import AwsS3Bucket from "../../../domain/services/awsS3Bucket.js";
import SendEmail from "../../../domain/services/sendEmail.js"

const sendEmail = new SendEmail()

const awsS3Bucket = new AwsS3Bucket()


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
                currency: orderData?.order?.currency || "usd",
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

    async addAddress(reqData) {
        try {

            const { orderId, addressId } = reqData;

            const isValidId = mongoose.Types.ObjectId.isValid(orderId);
            if (!isValidId) {
                throw {
                    status: 400,
                    message: `Invalid Order Id: ${orderId}`
                };
            }
            const isValidAddressId = mongoose.Types.ObjectId.isValid(addressId);
            if (!isValidAddressId) {
                throw {
                    status: 400,
                    message: `Invalid Address Id: ${addressId}`
                };
            }

            const orderData = await this.#orderRepositories.addAddress(orderId, addressId);

            return {
                status: 200,
                message: 'successful.',
                data: orderData
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while addAddress while adding address in order.'
            };
        }
    }
    async ApplyCoupon(reqData) {
        try {

            // console.log(reqData);
            const { orderId, coupon } = reqData
            const isValidId = mongoose.Types.ObjectId.isValid(orderId);
            if (!isValidId) {
                throw {
                    status: 400,
                    message: `Invalid Order Id: ${orderId}`
                };
            }


            const orderData = await this.#orderRepositories.ApplyCoupon(orderId, coupon);

            return {
                status: 200,
                data: orderData,
                message: "Order apply success"
            }


        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while adding address in order.'
            };
        }
    }
    async addCustomData(reqData, files) {
        try {
            const { orderId, productId, title, content } = reqData;

            const deleteFile = () => {
                if (!files || !files.length) return;
                files.forEach(file => {
                    try {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                            // console.log(`Deleted file: ${file.path}`);
                        }
                    } catch (err) {
                        console.error(`Error deleting file ${file.path}:`, err.message);
                    }
                });
            }


            const isValidId = mongoose.Types.ObjectId.isValid(orderId);
            if (!isValidId) {
                deleteFile()
                throw {
                    status: 400,
                    message: `Invalid Order Id: ${orderId}`
                };
            }
            const isValidProductId = mongoose.Types.ObjectId.isValid(productId);
            if (!isValidProductId) {
                deleteFile()
                throw {
                    status: 400,
                    message: `Invalid Product Id: ${productId}`
                };
            }

            const imagesUrl = await awsS3Bucket.storeImages(files);
            const addCustomData = await this.#orderRepositories.saveData(imagesUrl, orderId, productId, title, content)

            return {
                status: 200,
                message: "Custom Data added successfully.",
                data: addCustomData
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while add custom Data  in order.'
            };
        }
    }
    async takeAllOrders(userId) {
        try {

            const UserOrder = await this.#orderRepositories.takeUserOrder(userId);

            return UserOrder

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while take UserOrder  in order.'
            };
        }
    }
    async savePaymentStatus(orderId, reqData) {
        try {
            const isValidId = mongoose.Types.ObjectId.isValid(orderId);
            if (!isValidId) {
                deleteFile()
                throw {
                    status: 400,
                    message: `Invalid Order Id: ${orderId}`
                };
            }

            const orderData = await this.#orderRepositories.savePaymentStatus(orderId, reqData.paymentResult);
        //    console.log(222,reqData);
           
            if(reqData.paymentResult?.status=="succeeded"&&orderData){
                await  sendEmail.sendEmailPaymentSuccess(reqData.paymentResult?.billing_details?.email,orderData)
            }
            return {
                status: 200,
                data: orderData,
                message: "Payment Status updated successfully."
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred save order Status in useCase.'
            };
        }
    }


}

export default OrderUseCase;