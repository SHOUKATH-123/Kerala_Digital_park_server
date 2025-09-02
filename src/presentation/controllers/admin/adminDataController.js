

class AdminDataController {
    #adminDataUseCase
    constructor(adminDataUseCase) {
        this.#adminDataUseCase = adminDataUseCase
    }
    async updateProfile(req, res, next) {
        try {

            const data = req.body
            // console.log(1234,data);

            const response = await this.#adminDataUseCase.updateProfile(data)
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, data: response.data });
            }
            return res.status(response.status).json({ message: response.message })

        } catch (error) {
            next(error)
        }
    }
    async updatePassword(req, res, next) {
        try {
            const data = req.body
            // console.log(111, data);
            const response = await this.#adminDataUseCase.updatePassword(data)
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, data: response.data });
            }
            return res.status(response.status).json({ message: response.message })

        } catch (error) {
            next(error)
        }
    }
    async getTopData(req, res, next) {
        try {
            
            const response = await this.#adminDataUseCase.takeTopData()
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, data: response.data })
            }
            return res.status(response.status).json({ message: response.message })

        } catch (error) {
            next(error)
        }
    }
}

export default AdminDataController