import mongoose from "mongoose";

class HomeUseCase{
    #homeRepository
    constructor(homeRepository){
       this.#homeRepository=homeRepository
    }
    async takeAllProduct(){ 
        try {
            
            const productData=await this.#homeRepository.takeAllProduct()
            return {
                status:200,
                data:productData
            }
        } catch (error) {
             return {
                status: error.status || 500,
                message: error.message || 'An error occurred during take product Data'
            };
        }
    }
    async addToCard(body,userId){
        try {
           
            const { productId, quantity } = body;
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return {
                    status: 400,
                    message: 'Invalid productId'
                };
            }
            const orgQuantity= parseInt(quantity)||0; 
            if (orgQuantity <= 0) {
                return {
                    status: 400,
                    message: 'Invalid quantity'
                };
            }           
            await this.#homeRepository.addToCart(productId,orgQuantity, userId);
            return {
                status: 200,
                message: 'Product added to card successfully'
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while adding product to card'
            };
        }
    }
    async takeCartData(userId) {
        try {
            const cardData =await this.#homeRepository.takeCartData(userId);
            return {
                status: 200,
                data: cardData,
                message: 'Cart data retrieved successfully'
            };

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while taking cart data'
            };
        }
    }
    async updateCartQuantity(reqData){
        try {
            const {cartId, productId, newQty} = reqData;
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return {
                    status: 400,
                    message: 'Invalid cartId or productId'
                };
            }
            const orgQuantity = parseInt(newQty) || 0;
            if (orgQuantity <= 0) {
                return {
                    status: 400,
                    message: 'Invalid quantity'
                };
            }
            const newProductData = await this.#homeRepository.updateCartQuantity(cartId, productId, orgQuantity);
            
            return {
                status: 200,
                message: 'Cart quantity updated successfully',
                data: newProductData
            };
            
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while updating cart quantity'
            };
            
        }
    }
    async removeCartItem(reqData){
        try {
            const { cartId, productId } = reqData;
            
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return {
                    status: 400,
                    message: 'Invalid cartId or productId'
                };
            }

            await this.#homeRepository.removeCartItem(cartId, productId);
            return {
                status: 200,
                message: 'Cart item removed successfully'
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while removing cart item'
            };
        }
    }
    async addToWishlist(userId, productId){
        try {
            // console.log(userId, productId,90909);
            if (!mongoose.Types.ObjectId.isValid(productId)){
                return {
                    status: 400,
                    message: 'Invalid  productId'
                };
            }
            await this.#homeRepository.addToWishlist(userId, productId);

            return {
                status: 200,
                message: 'Product added to wishlist successfully'
            };
            
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while adding product to wishlist'
            };
            
        }
    }
    async takeWishlistData(userId) {
        try {
            const wishlistData = await this.#homeRepository.takeWishlistData(userId);
            return {
                status: 200,
                data: wishlistData,
                message: 'Wishlist data retrieved successfully.'
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while taking wishlist data'
            };
        }
    }
    async removeWishlistItem( productId,userId){
        try {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return {
                    status: 400,
                    message: 'Invalid productId'
                };
            }
            await this.#homeRepository.removeWishlistItem(productId,userId);
            return {
                status: 200,
                message: 'Wishlist item removed successfully'
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while removing wishlist item'
            };
        }
    }
}
export default HomeUseCase;