
class AdminOrderController {
    #adminOrderUseCase;
    constructor(adminOrderUseCase) {
        this.#adminOrderUseCase = adminOrderUseCase;

    }
    async getAllOrders(req, res, next) {

        try {

            const response = await this.#adminOrderUseCase.getAllOrders(req.query);

            if (response.status == 200) {
                return res.status(200).json({ message: response.message, orderData: response.data });
            }
            return res.status(response.status).json({ message: response.message });

        } catch (error) {
            next(error);
        }
    }
    async updateOrderStatus(req, res, next) {
        try {
            // console.log(req.body);
            const response = await this.#adminOrderUseCase.updateOrderStatus(req.body);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
    async getOrderById(req, res, next) {
        try {
            const orderId = req.params.id;
            //    console.log(1234,orderId);
            const response = await this.#adminOrderUseCase.getOrderById(orderId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, data: response.data });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
}

export default AdminOrderController;