import mongoose from "mongoose";


class AdminCategoryUseCase {
    #adminCategoryRepository
    constructor(adminCategoryRepository) {
        this.#adminCategoryRepository = adminCategoryRepository
    }

    async addCategory(categoryData) {
        try {
            if (!categoryData || !categoryData.name || categoryData.name.trim().length < 3) {
                throw {
                    status: 400,
                    message: 'Category name is required and must be at least 3 characters long.'
                };
            }
            const saveCategory = await this.#adminCategoryRepository.saveCategory(categoryData);
            return {
                status: 200,
                message: ' successfully Added new Category',
                data: saveCategory
            };

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in add Category. UseCase'
            };
        }
    }
    async takeAllCategory(reqData) {
        try {
            const { limit, page, sort } = reqData;
            const categoryData = await this.#adminCategoryRepository.takeAllCategoryData(limit, page, sort);
            return categoryData;
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in take all Category. UseCase'
            };
        }
    }
    async updataListing(reqData) {
        try {
            // console.log(reqData);
            const { id, list } = reqData
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw { status: 400, message: 'Invalid MongoDB ID format' };
            }
            const categoryData = await this.#adminCategoryRepository.updataListing(id, list);
            return { status: 200, message: 'Category listing updated successfully', data: categoryData }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in updating listing Category. UseCase'
            };
        }
    }
    async deleteCategory(categoryId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                throw { status: 400, message: 'Invalid MongoDB ID format' };
            }
            const deleteCategoryId = await this.#adminCategoryRepository.deleteCategory(categoryId)
            return { status: 200, message: `Category deleted successfully. Deleted category ID: ${deleteCategoryId}` }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in delete Category. UseCase'
            };
        }
    }
    async updateCategory(updatedData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(updatedData.categoryId)) {
                throw { status: 400, message: 'Invalid Category ID format' };
            }
            const orgCategoryData = await this.#adminCategoryRepository.findCategoryData(updatedData.categoryId);

            if (!orgCategoryData) {
                throw {
                    status: 404,
                    message: 'Category not found.'
                };
            }
            const fieldsToCheck = ['name', 'description'];
            let update = false
            let updatedCategory = null
            for (const field of fieldsToCheck) {
                if (updatedData.hasOwnProperty(field)) {
                    // Handle different data types properly
                    if (orgCategoryData[field] !== updatedData[field]) {
                        update = true
                        updatedCategory = await this.#adminCategoryRepository.updateData(field, updatedData[field], orgCategoryData._id);
                    }
                }
            }

            return {
                status: 200,
                message: 'Category updating successfully.',
                updated: update ? true : false,
                data: update ? updatedCategory : null
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in update Category.in UseCase'
            };
        }
    }
    async searchValue(value) {
        try {
            if (!value || typeof value !== 'string' || value.trim() === '') {
                return {
                    status: 400,
                    message: 'Search value is required and must be a non-empty string.'
                };
            }
            const categoryData = await this.#adminCategoryRepository.searchCategory(value);
            return {
                status: 200,
                message: 'Search successful.',
                data: categoryData
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in search Category . UseCase'
            };

        }
    }
    async getAllUsers(reqData) {
        try {
            const { limit, page } = reqData;
            const userData = await this.#adminCategoryRepository.getAllUsers(limit, page);

            return userData

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in get all users. UseCase'
            };

        }
    }
    async blockUser(reqData) {
        try {


            const { userId, action } = reqData
            // await 
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw { status: 400, message: 'Invalid User ID format' };
            }

            await this.#adminCategoryRepository.userBlock(userId, action)


            return {
                status: 200,
                message: 'User Block/unblock successful.'
            }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in Block users. UseCase'
            };
        }
    }
    async searchUser(value) {
        try {
            if (!value) {
                return res.status(400).json({ message: 'Search query is required.' });
            }
            const userData = await this.#adminCategoryRepository.searchUser(value)
            return {
                status: 200,
                message: 'Search success.',
                data: userData
            }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in search users. UseCase'
            };
        }
    }
    async takeUserDetails(userId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw { status: 400, message: 'Invalid User ID format' };
            }
            const userDetails=await this.#adminCategoryRepository.takeUserDetails(userId);

            return{
                status:200,
                message:'take user details successful.',
                data:userDetails
            }
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in take user details. UseCase'
            };
        }
    }
}

export default AdminCategoryUseCase;