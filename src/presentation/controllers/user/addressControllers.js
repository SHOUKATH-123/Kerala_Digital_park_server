import { addressValidationSchema } from '../../../security/addressValidation.js';

class AddressRouter {
    #addressUseCase;;
    constructor(addressUseCase) {
        this.#addressUseCase = addressUseCase;
    }
    async addAddress(req, res, next) {
        try {
            const { error, value } = addressValidationSchema.validate(req.body, { abortEarly: false });

            if (error) {
                const errors = error.details.map(err => err.message);
                return res.status(400).json({ errors });
            }
            const userId = req.user; 
            const response = await this.#addressUseCase.addAddress(value, userId);

            if (response.status == 200) {
                return res.status(200).json({ message: response.message, addressData: response.data })
            }
            return res.status(response.status).json({ message: response.message });
            
        } catch (error) {
            next(error)
        }
    }
    async getAddresses(req, res, next){
        try {
            const userId = req.user;
            const response = await this.#addressUseCase.getAddresses(userId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, addresses: response.data });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error);  
        }
    }
    async deleteAddress(req, res, next){
        try {
            const addressId = req.params.id;
            const userId = req.user; 
            const response = await this.#addressUseCase.deleteAddress(addressId,userId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
}

export default AddressRouter;