
import Coupon from "../../../infrastructure/database/models/couponModel.js";

class AdminCouponRepository {

    async addCoupon(couponDetails) {


        try {

            const checkExists = await Coupon.findOne({ code: couponDetails.code });
            if (checkExists) {
                throw { status: 400, message: "Coupon code already exists" };
            }


            const newCoupon = new Coupon({
                code: couponDetails.code,
                title: couponDetails.title,
                description: couponDetails.description,
                discount: couponDetails.discount,
                minPrice: couponDetails.minPrice,
                totalCoupon: couponDetails.totalCoupon,
                expiryDate: couponDetails.expiryDate,
                status: couponDetails.status
            });

            const savedCoupon = await newCoupon.save();
            return savedCoupon;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error adding coupon to the database'
            };
        }
    }
    async getAllCoupons() {
        try {
            const coupons = await Coupon.find().sort({ createdAt: -1 });
            return coupons;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error fetching coupons from the database'
            };
        }
    }
    async deleteCoupon(couponId) {
        try {
            const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
            if (!deletedCoupon) {
                throw { status: 404, message: "Coupon not found" };
            }
            // console.log(deletedCoupon);

            return deletedCoupon;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error deleting coupon from the database'
            };
        }
    }
    async updateCoupon(couponId, updateData) {
        try {

            const existingCoupon = await Coupon.findById(couponId);
            if (!existingCoupon) {
                throw { status: 404, message: "Coupon not found" };
            }
            
          
            const { _id, createdAt, updatedAt, __v, ...sanitizedData } = updateData;
            
            if (sanitizedData.code && sanitizedData.code !== existingCoupon.code) {
              
                const codeExists = await Coupon.findOne({ code: sanitizedData.code });

                if (codeExists) {
                    throw { status: 400, message: "Coupon code must be unique" };
                }
            }
            
            if (sanitizedData.expiryDate) {
                sanitizedData.expiryDate = new Date(sanitizedData.expiryDate);
            }

           
            let hasChanges = false;
            for (const key in sanitizedData) {
                
                if (String(existingCoupon[key]) !== String(sanitizedData[key])) {
                    hasChanges = true;
                    break;
                }
            }

            if (!hasChanges) {
                throw { message: "No changes detected", coupon: existingCoupon };
            }

           
            const updatedCoupon = await Coupon.findByIdAndUpdate(
                couponId,
                { ...sanitizedData },
                { new: true, runValidators: true }
            );
            return updatedCoupon;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Error delete coupon from the database'
            }
        }
    }

}

export default AdminCouponRepository;