
import Product from "../../../infrastructure/database/models/productModel.js";
import Order from "../../../infrastructure/database/models/orderModel.js";


class OrderRepositories {

    async createOrder(products, userId) {
        try {

            const validatedProducts = [];

            for (const item of products) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw { status: 404, message: `Product not found: ${item.productId}` };
                }


                if (product.stock <= 0) {
                    throw { status: 400, message: `Product is out of stock: ${product.name}. ProductId is ${product._id}.` };
                }
                if (item.quantity > product.stock) {
                    throw { status: 400, message: `Requested quantity (${item.quantity}) for ${product.name} exceeds available stock (${product.stock}). ProductId is ${product._id}.` };
                }
                //'size', 'paper', 'finish', 'corner'
                validatedProducts.push({
                    product: product._id,
                    name: product.name,
                    quantity: item.quantity,
                    price: product.price,
                    image: product.images[0] || '',
                    size: item.size,
                    paper: item.paper,
                    finish: item.finish,
                    corner: item.corner
                });

            }

            for (const item of validatedProducts) {
                await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
            }
            const itemsPrice = validatedProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
            // const taxPrice = itemsPrice * 0.1; // Assume 10% tax
            const taxPrice = 0;
            // const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping if total > ₹1000
            const shippingPrice = 0
            const totalPrice = itemsPrice + taxPrice + shippingPrice;

            const newOrder = new Order({
                user: userId,
                orderItems: validatedProducts,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const savedOrder = await newOrder.save();

            return savedOrder;


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while creating the order.'
            };
        }
    }
    async takeOrderData(orderId) {
        try {

            const orderData = await Order.findById(orderId)

            if (!orderData) {
                throw {
                    status: 404,
                    message: 'Order not found. Please check the order ID and try again.'
                };
            }
             return orderData

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while creating  the payment.'
            };
        }
    }
}

export default OrderRepositories;