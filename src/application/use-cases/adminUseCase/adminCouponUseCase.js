import mongoose from "mongoose";

class AdminCouponUseCase {
    #adminCouponRepository;
    constructor(adminCouponRepository) {
        this.#adminCouponRepository = adminCouponRepository;
    }

    async createCoupon(couponDetails) {
        try {

            const { code, title, description, discount, minPrice, totalCoupon, expiryDate, status } = couponDetails;

            if (!code || typeof code !== "string" || code.trim().length < 3) {
                throw { status: 400, message: "Coupon code is required and must be at least 3 characters" };
            }

            if (!title || typeof title !== "string" || title.trim().length < 3) {
                throw { status: 400, message: "Title is required and must be at least 3 characters" };
            }

            if (!description || typeof description !== "string" || description.trim().length < 5) {
                throw { status: 400, message: "Description is required and must be at least 5 characters" };
            }

            if (!discount || isNaN(discount) || Number(discount) <= 0) {
                throw { status: 400, message: "Discount must be a positive number" };
            }

            if (!minPrice || isNaN(minPrice) || Number(minPrice) <= 0) {
                throw { status: 400, message: "Minimum price must be a positive number" };
            }

            if (!totalCoupon || isNaN(totalCoupon) || Number(totalCoupon) <= 0) {
                throw { status: 400, message: "Total coupons must be a positive number" };
            }

            if (!expiryDate || isNaN(Date.parse(expiryDate))) {
                throw { status: 400, message: "Valid expiry date is required" };
            }

            const expiry = new Date(expiryDate);
            if (expiry < new Date()) {
                throw { status: 400, message: "Expiry date must be a future date" };
            }

            const newCoupon = await this.#adminCouponRepository.addCoupon(couponDetails);

            return {
                status: 200,
                message: 'Coupon created successfully',
                data: newCoupon
            };

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error creating coupon'
            };
        }
    }
    async getAllCoupons() {
        try {
            const allCoupons = await this.#adminCouponRepository.getAllCoupons();
            return {
                status: 200,
                message: 'Coupons fetched successfully',
                data: allCoupons
            }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error creating coupon'
            };
        }
    }
    async deleteCoupon(couponId) {
        try {
            console.log(couponId, 8989);
            if (!couponId) {
                throw { status: 400, message: "Coupon ID is required" };
            }
            if (!mongoose.Types.ObjectId.isValid(couponId)) {
                throw { status: 400, message: 'Invalid Coupon ID format' };
            }

            await this.#adminCouponRepository.deleteCoupon(couponId);
            return {
                status: 200,
                message: 'Coupon deleted successfully'
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error deleting coupon'
            };
        }
    }
    async updateCoupon(couponId, updateData) {
        try {

            if (!couponId) {
                throw { status: 400, message: "Coupon ID is required" };
            }
            if (!mongoose.Types.ObjectId.isValid(couponId)) {
                throw { status: 400, message: 'Invalid Coupon ID format' };
            }

            if (updateData.code && (typeof updateData.code !== "string" || updateData.code.trim().length < 3)) {
                throw { status: 400, message: "Coupon code must be at least 3 characters" };
            }

            if (updateData.title && (typeof updateData.title !== "string" || updateData.title.trim().length < 3)) {
                throw { status: 400, message: "Title must be at least 3 characters" };
            }

            if (updateData.description && (typeof updateData.description !== "string" || updateData.description.trim().length < 5)) {
                throw { status: 400, message: "Description must be at least 5 characters" };
            }

            if (updateData.discount && (isNaN(updateData.discount) || Number(updateData.discount) <= 0)) {
                throw { status: 400, message: "Discount must be a positive number" };
            }

            if (updateData.minPrice && (isNaN(updateData.minPrice) || Number(updateData.minPrice) <= 0)) {
                throw { status: 400, message: "Minimum price must be a positive number" };
            }

            if (updateData.totalCoupon && (isNaN(updateData.totalCoupon) || Number(updateData.totalCoupon) <= 0)) {
                throw { status: 400, message: "Total coupons must be a positive number" };
            }

            if (updateData.expiryDate) {
                if (isNaN(Date.parse(updateData.expiryDate))) {
                    throw { status: 400, message: "Valid expiry date is required" };
                }
            }

            const updatedCoupon = await this.#adminCouponRepository.updateCoupon(couponId, updateData);
            return {
                status: 200,
                message: 'Coupon updated successfully',
                data: updatedCoupon
            };
            

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error updating coupon'
            };
        }
    }

}
export default AdminCouponUseCase;