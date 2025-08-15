

class HomeController{
    #homeUseCase
    constructor(homeUseCase){
         this.#homeUseCase=homeUseCase
    }
    async takeAllProduct(req,res,next){ 
        try {
           const response = await this.#homeUseCase.takeAllProduct();
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, productData: response.data });
            }
            return res.status(response.status).json({ message: response.message });

        } catch (error) {
            next(error)
        }
    }
    async addToCard(req, res, next){
        try {
            const userId=req.user; 
            const response = await this.#homeUseCase.addToCard(req.body,userId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message});
            }
            return res.status(response.status).json({ message: response.message });  
        } catch (error) {
            next(error)
        }
    }
    async takeCartData(req, res, next){
        try {
            const userId=req.user;
            
            const response = await this.#homeUseCase.takeCartData(userId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, cartData: response.data });
            }
            return res.status(response.status).json({ message: response.message });
            
        } catch (error) {
            next(error)
        }
    };
    async updateCartQuantity(req,res,next){
        try {
           
            const response = await this.#homeUseCase.updateCartQuantity(req.body);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, cartItemData: response.data });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
    async removeCartItem(req, res, next){
        try {
            const response = await this.#homeUseCase.removeCartItem(req.query);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message });
            }
            return res.status(response.status).json({ message: response.message });
            
        } catch (error) {
            next(error)
        }
    }
    async addToWishlist(req, res, next){
        try {
            const userId = req.user;
            const productId = req.query.productId;
            const response = await this.#homeUseCase.addToWishlist(userId, productId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message });
            }
            return res.status(response.status).json({ message: response.message });
            
        } catch (error) {
            next(error)
        }
    }
    async takeWishlistData(req,res,next){
        try { 
            const userId = req.user;
            const response = await this.#homeUseCase.takeWishlistData(userId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, wishlistData: response.data });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
    async removeWishlistItem(req, res, next) {
        try {
            const userId = req.user;
            const { productId } = req.query;
            const response = await this.#homeUseCase.removeWishlistItem( productId,userId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
}

export default HomeController;