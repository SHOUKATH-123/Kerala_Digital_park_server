import { categorySchema,updateCategorySchema } from '../../../security/productDataValidation.js'

class AdminCategoryController {
    #adminCategoryUseCase
    constructor(adminCategoryUseCase) {
        this.#adminCategoryUseCase = adminCategoryUseCase
    }

    async addCategory(req, res, next) {
        try {
            // console.log(req.body);
            const { error } = categorySchema.validate(req.body, { abortEarly: false });

            if (error) {
                return res.status(400).json({
                    message: 'Validation failed.',
                    details: error.details.map(detail => detail.message)
                });
            }

            const response = await this.#adminCategoryUseCase.addCategory(req.body);

            if (response.status == 200) {
                return res.status(200).json({ message: response.message, categoryData: response.data });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
    async takeAllCategory(req, res, next) {
        try {
            const response = await this.#adminCategoryUseCase.takeAllCategory(req.query);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, categoryData: response.data, pagination: response.pagination });
            }
            return res.status(response.status).json({ message: response.message });

        } catch (error) {
            next(error)
        }
    }
    async updataListing(req, res, next) {
        try {
            const response = await this.#adminCategoryUseCase.updataListing(req.query);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, categoryData: response.data });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
    async deleteCategory(req, res, next) {
        try {
            const response = await this.#adminCategoryUseCase.deleteCategory(req.params.id);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
    async updateCategory(req, res, next) {
        try {
            try {

                const { error } = updateCategorySchema.validate(req.body, { abortEarly: false });
                if (error) {
                    return res.status(400).json({
                        message: 'Validation failed.',
                        details: error.details.map(detail => detail.message)
                    });
                }
                const response = await this.#adminCategoryUseCase.updateCategory(req.body);
                if (response.status == 200) {
                    return res.status(200).json({ message: response.message,data:response.data,updated:response.updated });
                }
                return res.status(response.status).json({ message: response.message });
            } catch (error) {
                next(error)
            }

        } catch (error) {
            next(error)
        }
    }
    async getAllUsers(req,res,next){
        try {
           
            const response = await this.#adminCategoryUseCase.getAllUsers(req.query);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, users: response.data, pagination: response.pagination });
            }
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
}

export default AdminCategoryController;