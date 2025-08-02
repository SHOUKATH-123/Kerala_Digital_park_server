import Category from "../../../infrastructure/database/models/categoryModel.js";
import Product from "../../../infrastructure/database/models/productModel.js";
import User from '../../../infrastructure/database/models/userModel.js'
import Address from '../../../infrastructure/database/models/addressModel.js'
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

            return {
                _id: data._id,
                name: data.name,
                description: data.description,
                isListed: data.isListed,
                productCount: 0
            };

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Add new Category filed.'
            };
        }
    }
    async takeAllCategoryData(limit, page, sort) {
        try {
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            const totalCount = await Category.countDocuments();


            const pipeline = [
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'products'
                    }
                },
                {
                    $addFields: {
                        productCount: { $size: '$products' }
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        isListed: 1,
                        productCount: 1
                    }
                }
            ];

            if (sort === 'assenting') {
                pipeline.push({ $sort: { productCount: 1, createdAt: -1 } });
            } else if (sort === 'dissenting') {
                pipeline.push({ $sort: { productCount: -1, createdAt: -1 } });
            } else {
                pipeline.push({ $sort: { _id: -1 } });
            }

            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limitNumber });

            const categories = await Category.aggregate(pipeline);

            const totalPages = Math.ceil(totalCount / limitNumber);

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
            const updateCategory = await Category.findByIdAndUpdate(
                id,
                { $set: updateObject },
                { new: true, select: 'name description isListed' }
            );

            if (!updateCategory) {
                throw {
                    status: 404,
                    message: 'Category not found'
                };
            }

            // Count products using this category
            const productCount = await Product.countDocuments({ category: id });

            return {
                name: updateCategory.name,
                description: updateCategory.description,
                isListed: updateCategory.isListed,
                productCount
            };

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Update Category is filed. in adminCategoryRepository'
            };
        }
    }
    async searchCategory(value) {
        try {
            const categories = await Category.aggregate([
                {
                    $match: {
                        $or: [
                            { name: { $regex: value, $options: 'i' } },
                            { description: { $regex: value, $options: 'i' } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'products'
                    }
                },
                {
                    $addFields: {
                        productCount: { $size: '$products' }
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        isListed: 1,
                        productCount: 1
                    }
                },
                { $limit: 10 }
            ]);

            return categories;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Search categories failed.'
            };
        }
    }
    async getAllUsers(limit, page) {
        try {
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            const totalCount = await User.countDocuments();
            const users = await User.find()
                .select('firstName lastName email country isVerified isBlocked createdAt')
                .skip(skip)
                .limit(limitNumber)
                .sort({ createdAt: -1 });

            const totalPages = Math.ceil(totalCount / limitNumber);

            return {
                status: 200,
                message: 'Users fetched successfully.',
                data: users,
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
                message: error.message || 'Fetch users failed.'
            };
        }
    }
    async userBlock(userId, action) {
        try {
            const Blocked = action == 'true' ? true : false;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { isBlocked: Blocked },
                { new: true }
            );

            if (!updatedUser) {
                throw { status: 404, message: 'User not found' };
            }

            return

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Fetch users failed.'
            };
        }
    }
    async searchUser(query) {
        try {
            const searchQuery = {
                $or: [
                    { firstName: { $regex: query, $options: 'i' } },
                    { lastName: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $concat: ["$firstName", " ", "$lastName"] },
                                regex: query,
                                options: "i"
                            }
                        }
                    }
                ]
            };

            const users = await User.find(searchQuery)
                .select('firstName lastName email country isVerified isBlocked createdAt')
                .limit(10);

            return users;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Search users failed.'
            };
        }
    }
    async takeUserDetails(userId) {
        try {
            const user = await User.findById(userId)
                .select('firstName lastName email country isVerified isBlocked createdAt updatedAt');

            if (!user) {
                throw { status: 404, message: 'User not found' };
            }

            const addresses = await Address.find({ user: userId });


            return {
                user,
                addresses
            };
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'tke user details failed.'
            };
        }
    }
}

export default AdminCategoryRepository;