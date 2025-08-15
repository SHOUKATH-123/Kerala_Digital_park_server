import User from '../database/models/userModel.js'

class UserAuthenticationRepo {
    async verifyUser(userId) {
        try {

            const user = await User.findOne(
                { _id: userId },
                { isVerified: 1, isBlocked: 1 }
            );

            return user

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to fetch user data'
            };
        }
    }
}
export default UserAuthenticationRepo;