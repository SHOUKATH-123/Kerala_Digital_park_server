import { loginSchemaForAdmin } from '../../../security/validation.js'

class AdminController {
    #adminUseCase
    #adminJwtToken

    constructor(adminUseCase, adminJwtToken) {
        this.#adminUseCase = adminUseCase
        this.#adminJwtToken = adminJwtToken
    }
    async login(req, res, next) {
        try {
            // console.log(req.body);
            const { error } = loginSchemaForAdmin.validate(req.body, { abortEarly: false });

            if (error) {
                return res.status(400).json({
                    message: 'Validation failed.',
                    errors: error.details.map(detail => detail.message),
                });
            }

            const response = await this.#adminUseCase.login(req.body);
            if (response.status == 200) {

                await this.#adminJwtToken.generateToken(response.data.adminId, res);

                return res.status(200).json({ message: response.message, userData: response.data })
            }

            return res.status(response.status).json({ message: response.message }); F

        } catch (error) {
            next(error)
        }
    }
    async logout(req, res, next) {
        try {
            await this.#adminJwtToken.logout(res);
            return res.status(200).json({ message: 'Admin Logout successful.' })
        } catch (error) {
            next(error)
        }
    }


}

export default AdminController;