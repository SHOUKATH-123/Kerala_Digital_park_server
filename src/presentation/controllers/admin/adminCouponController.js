
class AdminCouponController {
    #adminCouponUseCase;
    constructor(adminCouponUseCase) {
        this.#adminCouponUseCase = adminCouponUseCase;
    }
    async createCoupon(req, res, next) {
        try {
            //    console.log(req.body);
            const response = await this.#adminCouponUseCase.createCoupon(req.body);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, data: response.data });
            }
            return res.status(response.status).json({ message: response.message });

        } catch (error) {
            next(error)
        }
    }
    async getAllCoupons(req, res, next) {
        try {
            // console.log("get all coupons");
            const response = await this.#adminCouponUseCase.getAllCoupons();
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, data: response.data })
            }
            return res.status(response.status).json({ message: response.message })
        } catch (error) {
            next(error)
        }
    }
    async deleteCoupon(req,res,next){
        try {
            const couponId=req.params.couponId;
            const response=await this.#adminCouponUseCase.deleteCoupon(couponId)
            if(response.status==200){
                return res.status(200).json({message:response.message})
            }
            return res.status(response.status).json({message:response.message})
        } catch (error) {
            next(error);
        }
    }
    async updateCoupon(req,res,next){
        try {
          const couponId=req.params.couponId;
          const updateData=req.body;
        //   console.log(couponId,updateData);
          const response=await this.#adminCouponUseCase.updateCoupon(couponId,updateData)
          if(response.status==200){
            return res.status(200).json({message:response.message,data:response.data});
          } 
          return res.status(response.status).json({message:response.message})
            
        } catch (error) {
            next(error);
        }
    }
}

export default AdminCouponController;