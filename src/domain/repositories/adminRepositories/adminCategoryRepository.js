import Category from "../../../infrastructure/database/models/categoryModel.js";
import Product from "../../../infrastructure/database/models/productModel.js";
import Review from "../../../infrastructure/database/models/productReview.js"
import AwsS3Bucket from '../../services/awsS3Bucket.js';

const awsS3Bucket = new AwsS3Bucket()

class AdminCategoryRepository {

    async saveCategory(categoryData) {
        try {
            const checkNameIsExists = await Category.findOne({ name: categoryData.name })
            if (checkNameIsExists) {
                throw {
                    status: 400,
                    message: `Category name "${categoryData.name}" already exists. Please choose a different name.`
                };
            }

            const newCategory = new Category(categoryData)

            const data = await newCategory.save()

            return data;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Add new Category filed.'
            };
        }
    }
    async takeAllCategoryData(limit, page) {
        try {
            // ✅ Convert to number and handle defaults
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            // ✅ Count total categories
            const totalCount = await Category.countDocuments();

            // ✅ Fetch paginated categories
            const categories = await Category.find()
                .skip(skip)
                .limit(limitNumber)
                .sort({ createdAt: -1 }); // optional: sort newest first

            // ✅ Calculate total pages
            const totalPages = Math.ceil(totalCount / limitNumber);

            // ✅ Return full pagination info
            return {
                status: 200,
                message: 'Categories fetched successfully.',
                data: categories,
                pagination: {
                    totalItems: totalCount,
                    currentPage: pageNumber,
                    totalPages,
                    pageSize: limitNumber
                }
            };
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Add new Category filed.'
            };
        }
    }
    async updataListing(id, list) {
        try {

            const updatedCategory = await Category.findByIdAndUpdate(
                id,
                { isListed: list === 'true' },
                { new: true }
            );
            if (!updatedCategory) {
                throw {
                    status: 404,
                    message: 'Category not found with provided ID',
                };
            }
            return updatedCategory;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Update Category filed. in adminCategoryRepository'
            };
        }
    }
    async deleteCategory(categoryId) {
        try {

            const deletedCategory = await Category.findByIdAndDelete(categoryId);

            if (!deletedCategory) {
                throw {
                    status: 404,
                    message: 'Category not found',
                };
            }

            const relatedProducts = await Product.find({ category: deletedCategory._id });

            let deletedProductIds = [];
            let deletedReviewCount = 0;

            // Step 3: Delete each product and its reviews
            for (const product of relatedProducts) {
                // Delete associated reviews
                if (product.reviews && product.reviews.length > 0) {
                    const deleteResult = await Review.deleteMany({ _id: { $in: product.reviews } });
                    deletedReviewCount += deleteResult.deletedCount || 0;
                }

                // Delete product
                await Product.findByIdAndDelete(product._id);
                if (product.images && product.images.length > 0) {
                    for (const imageUrl of product.images) {
                        await awsS3Bucket.deleteImageFromAwsS3(imageUrl)
                    }
                }
                deletedProductIds.push(product);
            }

            return deletedCategory._id;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Delete Category is filed. in adminCategoryRepository'
            };
        }
    }
    async findCategoryData(categoryId) {
        try {
            const categoryData = await Category.findById(categoryId)
            return categoryData;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Update Category is filed. in adminCategoryRepository'
            };
        }
    }
    async updateData(field, newData, id) {
        try {
            if (field == 'name') {
                const existingCategory = await Category.findOne({
                    name: newData,
                    _id: { $ne: id }
                });

                if (existingCategory) {
                    throw {
                        status: 409,
                        message: 'Category name already exists'
                    };
                }
            }
            const updateObject = {
                [field]: newData,  
                
            };
            const updateCategory = await Category.findByIdAndUpdate( id , { $set: updateObject }, { new: true });

            return updateCategory

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Update Category is filed. in adminCategoryRepository'
            };
        }
    }
}

export default AdminCategoryRepository;