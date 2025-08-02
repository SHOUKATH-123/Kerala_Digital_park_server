import Address from "../../../infrastructure/database/models/addressModel.js";

class AddressRepository {

    async saveAddress(addressData, userId) {
        try {
            
            const newAddress = new Address({
                ...addressData,
                user: userId,
            });

            const savedAddress = await newAddress.save();

            return savedAddress;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while save address.'
            };
        }
    }
    async getAddressesByUserId(userId) {
        try {
            const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
            if (!addresses || addresses.length === 0) {
                throw { status: 404, message: 'No addresses found for this user.' };
            }
            return addresses;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while fetching addresses.'
            };
        }
    }
    async deleteAddressById(addressId, userId) {
        try {
            const address = await Address.findById(addressId);
            if (!address) {
                throw { status: 404, message: 'Address not found.' };
            }
            const addressCount = await Address.countDocuments({ user: userId });

            if (addressCount <= 1) {
                throw {
                    status: 400,
                    message: 'At least one address is required. Cannot delete the only address.',
                };
            }
            await Address.deleteOne({ _id: addressId });

            return

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while deleting the address.'
            };
        }
    }

}

export default AddressRepository;