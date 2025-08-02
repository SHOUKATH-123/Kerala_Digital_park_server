
class OrderController {
    #orderUseCase;
    constructor(orderUseCase) {
        this.#orderUseCase = orderUseCase;

    }
    async createOrder(req, res, next) {
        try {
            const orderData = req.body; // Assuming order data is sent in the request body
            const userId = req.user; // Assuming user ID is available in the request object after authentication

            const response = await this.#orderUseCase.createOrder(orderData, userId);

            if (response.status == 200) {
                return res.status(200).json({ message: response.message, userData: response.data })
            }

            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error);
        }
    }
    async verifyOrder(req,res,next){
        try {
            console.log("verifyOrder called",12);
            
        } catch (error) {
            next(error); 
        }
    }
}

export default OrderController;