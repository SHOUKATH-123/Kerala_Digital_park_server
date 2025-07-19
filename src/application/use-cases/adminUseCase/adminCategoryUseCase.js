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
                data: {

                    categoryName: saveCategory.name,
                    _id: saveCategory._id,
                    description: saveCategory.description,
                    isListed: saveCategory.isListed
                }
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
            const { limit, page } = reqData;
            const categoryData = await this.#adminCategoryRepository.takeAllCategoryData(limit, page);
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
            let update=false
            let updatedCategory=null
            for (const field of fieldsToCheck) {
                if (updatedData.hasOwnProperty(field)) {
                    // Handle different data types properly
                    if (orgCategoryData[field] !== updatedData[field]) {
                      update=true
                      updatedCategory=await this.#adminCategoryRepository.updateData(field,updatedData[field],orgCategoryData._id);
                    }
                } 
            }        
            return {
                status:200,
                message:'Category updating successfully.',
                updated:update?true:false,
                data:update?updatedCategory:orgCategoryData
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in update Category.in UseCase'
            };
        }
    }
}

export default AdminCategoryUseCase;