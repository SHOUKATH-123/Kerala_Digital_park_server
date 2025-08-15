import Product from "../../../infrastructure/database/models/productModel.js";
import Category from "../../../infrastructure/database/models/categoryModel.js";

import Cart from "../../../infrastructure/database/models/cartModel.js";
import Wishlist from "../../../infrastructure/database/models/wishlistModel.js";
import mongoose from "mongoose";

class HomeRepository {

    async takeAllProduct() {
        try {
            const products = await Product.aggregate([
                { $match: { isListed: true } },
                {
                    $lookup: {
                        from: 'categories', localField: 'category', foreignField: '_id', as: 'category'
                    }
                }, {
                    $match: { 'category.isListed': true }
                }, {
                    $sort: { createdAt: -1 }
                },
                {
                    $project: {
                        name: 1, description: 1, price: 1, images: 1, subtitle: 1, stock: 1, rating: 1,
                        category: { name: 1, isListed: 1, _id: 1 }, createdAt: 1
                    }
                }
            ]); 

            return products
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to take product data'
            };
        }
    }
    async addToCart(productId, quantity, userId) {
        try {
            const productData = await Product.findById(productId)

            if (!productData) {
                throw {
                    status: 404,
                    message: 'Product not found'
                }
            }

            const stockQty = productData.stock

            let newQty = quantity;
            if (stockQty < quantity) {
                newQty = stockQty
            }
            if (stockQty <= 0) {
                newQty = 1;
            }

            const existingCart = await Cart.findOne({ userId });


            if (!existingCart) {
                const newCart = new Cart({
                    userId,
                    items: [{ productId, quantity: newQty }]
                });
                await newCart.save();
                if (stockQty <= 0) {
                    throw {
                        status: 400,
                        message: 'Product is out of stock'
                    }
                }
                if (stockQty < quantity) {
                    throw {
                        status: 400,
                        message: `Only ${stockQty} items available in stock, this also added to cart with quantity ${newQty}`
                    }
                }
                return;
            }


            const existingItem = existingCart.items.find(item => item.productId == productId);

            if (existingItem) {
                existingItem.quantity = newQty
            } else {
                existingCart.items.push({
                    productId,
                    quantity: newQty
                });
            }

            await existingCart.save();
            if (stockQty <= 0) {
                throw {
                    status: 400,
                    message: 'Product is out of stock'
                }
            }

            if (stockQty < quantity) {
                throw {
                    status: 400,
                    message: `Only ${stockQty} items available in stock, this also added to cart with quantity ${newQty}`
                }
            }
            return;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while adding product to cart'
            };

        }
    }
    async takeCartData(userId) {

        try {

            let cartData = null

            cartData = await Cart.findOne({ userId })
            if (!cartData) {
                const newCart = new Cart({
                    userId,
                });

                cartData = await newCart.save();

                return cartData;

            };

            // If cart exists but items array is empty
            if (!cartData.items || cartData.items.length === 0) {
                return cartData
            }


            cartData = await Cart.aggregate([{
                $match: { userId: new mongoose.Types.ObjectId(userId) },
            }, {
                $unwind: {
                    path: '$items',
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productData',
                    pipeline: [{
                        $project: {
                            _id: 0, name: 1, price: 1, images: 1, description: 1,
                            rating: 1, createdAt: 1,size: 1,paper: 1,finish: 1, corner: 1,
                        },
                    },],
                },
            }, {
                $unwind: {
                    path: '$productData',
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $sort: { 'items.updatedAt': -1 }
            }, {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    items: {
                        $push: {
                            productId: '$items.productId',
                            quantity: '$items.quantity',
                            product: '$productData',
                        },
                    },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                },
            },]);

            return cartData[0]


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while taking cart data'
            };

        }
    }
    async updateCartQuantity(cartId, productId, quantity) {
        try {
            const productData = await Product.findById(productId)

            if (!productData) {
                throw {
                    status: 404,
                    message: 'Product not found'
                }
            }


            const stockQty = productData.stock

            let newQty = quantity;
            if (stockQty < quantity) {
                newQty = stockQty
            }
            if (stockQty <= 0) {
                newQty = 1;
            }

            const updatedCart = await Cart.findOneAndUpdate(
                {
                    _id: cartId,
                    'items.productId': productId,
                },
                {
                    $set: {
                        'items.$.quantity': newQty,
                        'items.$.updatedAt': new Date(),
                    },
                },
                { new: true }
            );

            if (!updatedCart) {
                throw {
                    status: 404,
                    message: 'Cart or product not found',
                };
            }

            // Find the updated item in the cart
            const updatedItem = updatedCart.items.find(
                item => item.productId.toString() === productId
            );

            if (!updatedItem) {
                throw {
                    status: 404,
                    message: 'Updated item not found in cart',
                };
            }

            // Get the product details
            const product = await Product.findById(productId).select('name price images description rating');

            if (!product) {
                throw {
                    status: 404,
                    message: 'Product not found',
                };
            }
            // console.log(product);
            if (stockQty <= 0) {
                throw {
                    status: 400,
                    message: 'Product is out of stock'
                }
            }

            if (stockQty < quantity) {
                throw {
                    status: 400,
                    message: `Only ${stockQty} items available in stock, this also added to cart with quantity ${newQty}`
                }
            }

            // Construct and return the response
            return {
                productId: updatedItem.productId,
                quantity: updatedItem.quantity,
                product: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    images: product.images,
                    rating: product.rating
                },
                updatedAt: updatedItem.updatedAt,
            };
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while updating cart quantity'
            };

        }
    }
    async removeCartItem(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);

            if (!cart) {
                throw {
                    status: 404,
                    message: 'Cart not found',
                };
            }

            // Step 2: Check if the product exists in the cart
            const productExists = cart.items.some(
                (item) => item.productId.toString() === productId
            );

            if (!productExists) {
                throw {
                    status: 404,
                    message: 'Product not found in cart',
                };
            }

            await Cart.findByIdAndUpdate(
                cartId,
                {
                    $pull: {
                        items: {
                            productId: productId
                        }
                    }
                },
                { new: true }
            );

            return

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while removing cart item'
            };
        }
    }
    async addToWishlist(userId, productId) {
        try {

            const productData = await Product.findById(productId)

            if (!productData) {
                throw {
                    status: 404,
                    message: 'Product not found'
                }
            }

            const existingWishlist = await Wishlist.findOne({ userId });

            if (!existingWishlist) {
                const newWishlist = new Wishlist({
                    userId,
                    products: [productId]
                });
                await newWishlist.save();

                return;
            }

            if (existingWishlist.products.includes(productId)) {
                throw {
                    status: 400,
                    message: 'Product already exists in wishlist'
                };
            }

            existingWishlist.products.push(productId);
            await existingWishlist.save();

            return;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while adding product to wishlist'
            };
        }
    }
    async takeWishlistData(userId) {
        try {
            const wishlist = await Wishlist.findOne({ userId }).populate('products', 'name price images description rating');
           
            if (!wishlist) {
                throw {
                    status: 404,
                    message: 'Wishlist not found.'
                };
            }

            return wishlist;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while taking wishlist data'
            };

        }
    };
    async removeWishlistItem(productId, userId) {
        try {
            const updatedWishlist = await Wishlist.findOneAndUpdate(
                { userId },
                {
                    $pull: { products: productId },
                },
                { new: true } 
            ).populate('products'); 

            if (!updatedWishlist) {
                throw {
                    status: 404,
                    message: 'Wishlist not found for this user',
                };
            }

           
            const stillExists = updatedWishlist.products.find(
                (prod) => prod._id.toString() === productId.toString()
            );

            if (stillExists) {
                throw {
                    status: 400,
                    message: 'Product was not removed from wishlist',
                };
            }

            return 
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while removing wishlist item'
            }
        }
    }

}
export default HomeRepository;