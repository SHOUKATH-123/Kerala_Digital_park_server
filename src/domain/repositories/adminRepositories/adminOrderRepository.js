
import Order from "../../../infrastructure/database/models/orderModel.js";

class AdminOrderRepository {
    async fetchAllOrders(limit, page, sort) {
        try {
            // Convert limit & page into numbers
            const perPage = Number(limit) || 10;
            const currentPage = Number(page) || 1;

            // Build sort option
            let sortOption = {};
            let filter = {};

            switch (sort) {
                case "date-desc":
                    sortOption = { createdAt: -1 }
                    filter.isPaid = true;
                    break;
                case "date-asc":
                    sortOption = { createdAt: 1 };
                    filter.isPaid = true;
                    break;
                case "processing-ord-asc":
                    sortOption = { createdAt: -1 };
                    filter.isPaid = true;
                    filter.status = "Processing";
                    break;
                case "delivered":
                    sortOption = { createdAt: -1 }
                    filter.isPaid = true;
                    filter.isDelivered = true;
                    break;
                case "not-delivered":
                    sortOption = { createdAt: -1 };
                    filter.isPaid = true;
                    filter.isDelivered = false;
                    break;
                case "unpaid":
                    sortOption = { createdAt: -1 };
                    filter.isPaid = false;
                    break;
                default:
                    sortOption = { createdAt: -1 };
                    filter = { isPaid: true };
                    break;
            }

            const orders = await Order.find(filter)
                .populate("user", "name email firstName lastName")
                .populate("orderItems.product", "name price")
                .sort(sortOption)
                .skip((currentPage - 1) * perPage)
                .limit(perPage);

            const totalFilteredOrders = await Order.countDocuments(filter);
            const processingOrders = await Order.countDocuments({ isPaid: true, status: "Processing" });

            return {
                success: true,
                data: orders,
                pagination: {
                    totalFilteredOrders,
                    currentPage,
                    totalPages: Math.ceil(totalFilteredOrders / perPage),
                    processingOrders
                },
            };
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error fetching orders from the database'
            };
        }
    }
    async modifyOrderStatus(orderId, status) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw { status: 404, message: 'Order not found' };
            }

            order.status = status || order.status;

            if (status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = new Date();
            }

            await order.save();

            return order;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error updating order status in the database'
            };
        }
    }
    async getOrderById(orderId) {
        try {
            const order = await Order.findById(orderId)
                .populate("shippingAddress")
                .populate("user", "name email firstName lastName")

            if (!order) {
                throw { status: 404, message: 'Order not found' };
            }
            // console.log(order);

            return order;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error retrieving order by ID from the database'
            };
        }
    }
}

export default AdminOrderRepository;