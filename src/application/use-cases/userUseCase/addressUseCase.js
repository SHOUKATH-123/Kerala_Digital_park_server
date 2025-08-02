import mongoose from "mongoose";

class AddressUseCase {
    #addressRepository;
    constructor(addressRepository) {
        this.#addressRepository = addressRepository;

    }
    async addAddress(value, userId) {
        try {
            const existingAddresses = await this.#addressRepository.getAddressesByUserId(userId);

            // 2. Check if the user already has 5 addresses
            if (existingAddresses.length >= 5){
                return {
                    status: 400,
                    message: 'You can only add up to 5 addresses. Please delete an existing address before adding a new one.',
                };
            }

            const addressData = await this.#addressRepository.saveAddress(value, userId);
            return {
                status: 200,
                message: 'Address added successfully',
                data: addressData
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while creating the address. in AddressUseCase',
            };
        }
    }
    async getAddresses(userId) {
        try {
            const addresses = await this.#addressRepository.getAddressesByUserId(userId);
            return {
                status: 200,
                message: 'Addresses fetched successfully',
                data: addresses
            }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while fetching addresses. in AddressUseCase',
            };
        }
    }
    async deleteAddress(addressId,userId){
        try {
           
            if(!mongoose.Types.ObjectId.isValid(addressId,userId)){
                return {
                    status: 400,
                    message: 'Invalid address ID.',
                };
            }
            await this.#addressRepository.deleteAddressById(addressId,userId);
            return {
                status: 200,
                message: 'Address deleted successfully',
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while deleting the address. in AddressUseCase',
            };
            
        }
    }
}

export default AddressUseCase;