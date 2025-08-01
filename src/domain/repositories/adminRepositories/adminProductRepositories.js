import mongoose from 'mongoose';
import Product from "../../../infrastructure/database/models/productModel.js";
import Category from "../../../infrastructure/database/models/categoryModel.js";
import Review from "../../../infrastructure/database/models/productReview.js"
import AwsS3Bucket from '../../services/awsS3Bucket.js';

const awsS3Bucket = new AwsS3Bucket()

class AdminProductRepositories {

    async checkCategory(categoryId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return null;
            }

            const category = await Category.findById(categoryId);
            return category;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Check Category fail in admin product repositories.'
            };
        }
    }
    async checkNameExists(productName) {
        try {
            const checkNameIsExists = await Product.findOne({ name: productName })
            if (checkNameIsExists) {
                throw {
                    status: 400,
                    message: `Product name already exists. Please choose a different name.`
                };
            }

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Check Product name is exist failed in admin product repositories.'
            };
        }
    }
    async addNewProduct(productData, imagesUrl) {
        try {

            const newProduct = new Product({
                ...productData,
                images: imagesUrl // must be an array of strings
            });

            // Save to DB
            const savedProduct = await newProduct.save();

            return savedProduct;


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Add new Product failed in admin product repositories.'
            };
        }
    }
    async takeAllProduct(limit, page, sortByStock) {
        try {
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            // ✅ Count total categories
            const totalCount = await Product.countDocuments();
            const outOfStock = await Product.countDocuments({ stock: { $lte: 0 } });
            // ✅ Fetch paginated categories

            let sortCriteria = { createdAt: -1 }; // default: newest first

            switch (sortByStock) {
                case 'descending':
                    sortCriteria = { stock: -1, createdAt: -1 }; // High to Low stock, then newest
                    break;
                case 'ascending':
                    sortCriteria = { stock: 1, createdAt: -1 }; // Low to High stock, then newest
                    break;
                case '':
                default:
                    sortCriteria = { createdAt: -1 }; // Default sorting by creation date
                    break;
            }
            const products = await Product.find()
                .populate('category', 'name')
                .skip(skip)
                .limit(limitNumber)
                .sort(sortCriteria ); // optional: sort newest first

            // ✅ Calculate total pages
            const totalPages = Math.ceil(totalCount / limitNumber);

            // ✅ Return full pagination info
            return {
                status: 200,
                message: 'Products fetched successfully.',
                data: products,
                pagination: {
                    totalItems: totalCount,
                    currentPage: pageNumber,
                    totalPages,
                    pageSize: limitNumber,
                    outOfStock
                }
            };

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Take All Product failed in admin product repositories.'
            };
        }
    }
    async updateListing(id, list) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { isListed: list === 'true' },
                { new: true }
            );
            if (!updatedProduct) {
                throw {
                    status: 404,
                    message: 'Product not found with provided ID',
                };
            }
            return updatedProduct;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Listing Update Product failed in admin product repositories.'
            };
        }
    }
    async deleteProduct(productId) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);

            if (!deletedProduct) {
                throw {
                    status: 404,
                    message: 'Product not found',
                };
            }

            if (deletedProduct.reviews && deletedProduct.reviews.length > 0) {
                await Review.deleteMany({ _id: { $in: deletedProduct.reviews } });
            }
            if (deletedProduct.images && deletedProduct.images.length > 0) {
                for (const imageUrl of deletedProduct.images) {
                    await awsS3Bucket.deleteImageFromAwsS3(imageUrl)
                }
            }

            return deletedProduct._id



        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Listing Update Product failed in admin product repositories.'
            };
        }
    }
    async takeProductData(productId) {
        try {
            const productData = await Product.findById(productId);
            if (!productData) {
                throw {
                    status: 404,
                    message: 'Product not found'
                }
            }
            return productData
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Find Product failed in admin product repositories.'
            };
        }
    }
    async updateData(field, newData, id) {
        try {
            if (field == 'name') {
                const existingCategory = await Product.findOne({
                    name: newData,
                    _id: { $ne: id }
                });

                if (existingCategory) {
                    throw {
                        status: 409,
                        message: 'Product name already exists'
                    };
                }
            }
            const updateObject = {
                [field]: newData,
            };
            const updateProductData = await Product.findByIdAndUpdate(id, { $set: updateObject }, { new: true });

            return updateProductData

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || ' Product updating failed in admin product repositories.'
            };
        }
    }
    async imageUpdating(productId, newImageArray) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { images: newImageArray }, // Replace the whole images array
                { new: true } // return updated product
            );

            if (!updatedProduct) {
                throw {
                    status: 404,
                    message: 'Product not found'
                };
            }

            return updatedProduct;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || ' Product updating failed in admin product repositories.'
            };
        }
    }
    async pushNewUrl(newImages, productId) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { $push: { images: { $each: newImages } } },
                { new: true }
            ) // return updated product

            if (!updatedProduct) {
                throw {
                    status: 404,
                    message: 'Product not found'
                };
            }

            return updatedProduct;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || ' Product updating failed in admin product repositories.'
            };
        }
    }
    async takeCategory() {
        try {
            const data = await Category.find({ isListed: true }, { name: 1 })
            return data;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || ' take category data failed in admin product repositories.'
            };
        }
    }
    async searchProduct(key) {
        try {
            const searchKey = key.trim();

            // First, find categories that match the search key
            const matchingCategories = await Category.find({
                name: { $regex: searchKey, $options: 'i' }
            }).select('_id');

            const categoryIds = matchingCategories.map(cat => cat._id);

            // Build search query including category search
            let searchQuery = {
                $or: [
                    { name: { $regex: searchKey, $options: 'i' } },
                    { brand: { $regex: searchKey, $options: 'i' } },
                    ...(categoryIds.length > 0 ? [{ category: { $in: categoryIds } }] : [])
                ]
            };

            const products = await Product.find(searchQuery)
                .populate('category', 'name')
                .limit(10)
                .sort({ createdAt: -1 });

            return products;


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Search Product is failed in admin product repositories.'
            };
        }
    }
}
export default AdminProductRepositories;