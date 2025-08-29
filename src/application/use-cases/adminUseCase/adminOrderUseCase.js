import mongoose from "mongoose";


class AdminOrderController {
    #adminOrderRepository;
    constructor(adminOrderRepository) {
        this.#adminOrderRepository = adminOrderRepository;
    }

    async getAllOrders(query) {
        try {

            const { limit, page, sort } = query;

            const NLimit = parseInt(limit) || 10;
            const NPage = parseInt(page) || 1;

            const orders = await this.#adminOrderRepository.fetchAllOrders(NLimit, NPage, sort);

            // console.log(orders);

            return {
                status: 200,
                message: 'Orders retrieved successfully',
                data: orders
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error retrieving orders'
            };
        }
    }
    async updateOrderStatus(data) {
        try {
            const { orderId, status } = data
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                throw { status: 400, message: 'Invalid Order ID format' };
            }
            const updatedOrder = await this.#adminOrderRepository.modifyOrderStatus(orderId, status);

            return {
                status: 200,
                message: 'Order status updated successfully',
                data: updatedOrder
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error updating order status'
            };
        }
    }
    async getOrderById(orderId){
        try {
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                throw { status: 400, message: 'Invalid Order ID format' };
            }
            const order = await this.#adminOrderRepository.getOrderById(orderId);
            
            return {
                status: 200,
                message: 'Order retrieved successfully',
                data: order
            };
            
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error retrieving order by ID'
            };
        }
    }
}

export default AdminOrderController;