
import Product from "../../../infrastructure/database/models/productModel.js";
import Order from "../../../infrastructure/database/models/orderModel.js";
import Coupon from "../../../infrastructure/database/models/couponModel.js";


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
    async addAddress(orderId, addressId) {
        try {

            const order = await Order.findByIdAndUpdate(
                orderId,
                { $set: { shippingAddress: addressId } },
                { new: true }
            );

            if (!order) {
                throw {
                    status: 404,
                    message: 'Order not found. Please check the order ID and try again.'
                }
            }

            return order;


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while adding address.'
            };
        }
    }
    async ApplyCoupon(orderId, couponCode) {
        try {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (!coupon) {
                throw { status: 404, message: "Coupon not found" };
            }

            // 2. Validate coupon
            if (coupon.status !== "active") {
                throw { status: 400, message: "Coupon is not active" };
            }


            if (coupon.expiryDate < new Date()) {
                throw { status: 400, message: "Coupon has expired" };
            }


            if (coupon.totalCoupon <= 1) {
                throw { status: 400, message: "Coupon is no longer available" };
            }

            const order = await Order.findById(orderId);
            if (!order) {
                throw { status: 404, message: "Order not found" };
            }
            if (order.appliedCoupon) {
                throw {
                    status: 400,
                    message: "A coupon has already been applied to this order.",
                };
            }


            if (order.totalPrice < coupon.minPrice) {
                throw {
                    status: 400,
                    message: `Order total must be at least ₹${coupon.minPrice} to use this coupon`,
                };
            }

            const finalPrice = order.totalPrice - coupon.discount;

            // console.log(111, finalPrice);

            order.appliedCoupon = coupon.code;
            order.discountAmount = coupon.discount;
            order.totalPrice = finalPrice

            const orderData = await order.save();


            coupon.totalCoupon -= 1;
            await coupon.save();

            return orderData;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while adding address.'
            };
        }
    }
    async saveData(imagesUrls, orderId, productId, title, content) {
        try {

            const order = await Order.findById(orderId);
            if (!order) {
                throw {
                    status: 404,
                    message: `Order not found for Id: ${orderId}`,
                };
            }

            // Find product inside orderItems
            const orderItem = order.orderItems.find(
                (item) => item.product.toString() === productId.toString()
            );

            if (!orderItem) {
                throw {
                    status: 404,
                    message: `Product not found in this order for Product Id: ${productId}`,
                };
            }

            // Update fields
            orderItem.userImage = imagesUrls && imagesUrls.length ? imagesUrls : orderItem.userImage;
            orderItem.title = title || orderItem.title;
            orderItem.content = content || orderItem.content;

            const newOrder = await order.save();

            return newOrder;



        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while save custom data.'
            };
        }
    }
    async takeUserOrder(userId) {
        try {
            const orders = await Order.find({ user: userId })
                .populate("user", "name email") // include user details if needed
                .populate("orderItems.product", "name price image") // include product details
                .sort({ createdAt: -1 }); // latest orders first

            if (!orders || orders.length === 0) {
                throw {
                    status: 404,
                    message: "No orders found for this user",
                };
            }

            return {
                status: 200,
                message: "User orders fetched successfully",
                data: orders,
            };
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while take user order data.'
            };
        }
    }
    async savePaymentStatus(orderId, reqData) {
        try {
           
            const order = await Order.findById(orderId);
            if (!order) {
                throw {
                    status: 404,
                    message: "Order not found",
                };
            }
            const { id, status, update_time, email_address } = reqData || {};

            // Update order fields
            order.isPaid = status === "succeeded";
            order.paidAt = status === "succeeded" ? Date.now() : null;
            if (status === "succeeded") {
                order.status = "Processing";
            }
            order.paymentResult = {
                id: id || "",
                status: status || "failed",
                update_time: update_time || new Date().toISOString(),
                email_address: email_address || "",
            };

            // Save changes
            const updatedOrder = await order.save();
            
            return updatedOrder;


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while update Payment status in repository.'
            };
        }
    }
}

export default OrderRepositories;