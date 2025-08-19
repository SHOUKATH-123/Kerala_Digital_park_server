import Product from "../../../infrastructure/database/models/productModel.js";
import Category from "../../../infrastructure/database/models/categoryModel.js";



class ProductRepository {

    async takeCategoryData() {
        try {
            const categories = await Category.find({ isListed: true }, { name: 1, isListed: 1 })
                .limit(7)
                .lean();

            const categoryWithProducts = await Promise.all(
                categories.map(async (category) => {
                    const products = await Product.find({ category: category._id, isListed: true }, { name: 1, price: 1, images: 1 })
                        .limit(10).lean();
                    return {
                        ...category,
                        products
                    };
                })
            );

            return categoryWithProducts;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while takeTobBarCategory in useCase.'
            };
        }
    }
    async takeProductDetails(productId) {
        try {

            const productData = await Product.findOne({ _id: productId });

            if (!productData) {
                throw {
                    status: 404,
                    message: 'Product not found.'
                };
            }

            if (!productData.isListed) {
                throw {
                    status: 403,
                    message: 'This product is currently unavailable.'
                };
            }

            return productData;


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while take product details in useCase.'
            };
        }
    }
    

}

export default ProductRepository;