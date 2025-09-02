import Admin from "../../../infrastructure/database/models/adminModel.js";
import Users from "../../../infrastructure/database/models/userModel.js"
import Orders from "../../../infrastructure/database/models/orderModel.js"
import Product from "../../../infrastructure/database/models/productModel.js"
import Category from "../../../infrastructure/database/models/categoryModel.js"



class AdminDataRepository {
    async updateProfile(adminId, fields) {
        try {

            if (!adminId) {
                throw { status: 400, message: "Admin ID is required" };
            }

            if (!fields || Object.keys(fields).length === 0) {
                throw { status: 400, message: "No fields provided for update" };
            }

            const updatedAdmin = await Admin.findByIdAndUpdate(
                adminId,
                { $set: fields },  // safely update only given fields
                { new: true, runValidators: true } // return updated doc & apply schema validators
            );

            if (!updatedAdmin) {
                throw { status: 404, message: "Admin not found" };
            }

            return updatedAdmin;
            // console.log(updatedAdmin);


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error updating admin Profile from the database'
            };
        }
    }
    async updatePassword(adminId, currentPassword, newPassword) {
        try {
            const admin = await Admin.findById(adminId);
            if (!admin) {
                throw { status: 404, message: "Admin not found" };
            }

            // 2. Check if current password matches
            const isMatch = await admin.comparePassword(currentPassword);
            if (!isMatch) {
                throw { status: 400, message: "Current password is incorrect" };
            }

            // 3. Update password and save (pre-save hook will hash it)
            admin.password = newPassword;
            await admin.save();




            return { status: 200, message: "Password updated successfully" };
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error updating admin Profile from the database'
            };
        }
    }
    async takeTopData() {
        try {

            const [totalUsers, totalProducts, totalCategories, totalOrders] = await Promise.all([
                Users.countDocuments(),
                Product.countDocuments(),
                Category.countDocuments(),
                Orders.countDocuments()
            ]);

            return {
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders
            };

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error take dashboard data from the database'
            };
        }
    }
}

export default AdminDataRepository;