import Admin from "../../../infrastructure/database/models/adminModel.js";

class AdminRepository {

    async login(email,candidatePassword) {
        try {

            const adminData = await Admin.findOne({ email: email })

            if (!adminData) {
                throw {
                    status: 404,
                    message: 'Admin account not found with this email'
                };
            };

            const isMatch = await adminData.comparePassword(candidatePassword);

            if (!isMatch) {
                throw {
                    status: 401,
                     message: 'Incorrect password. Please check and try again.',
                };
            }

            return adminData;


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Admin login failed'
            };
        }

    }
    
}

export default AdminRepository;