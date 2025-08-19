
class ProductController {
    #productUseCase
    constructor(productUseCase) {
        this.#productUseCase = productUseCase
    }
    async takeTobBarCategory(req, res, next) {
        try {
            const response = await this.#productUseCase.takeTobBarCategory()

            if (response.status == 200) {
                return res.status(200).json({ message: response.message, data: response.data })
            }
            return res.status(response.status).json({ message: response.message })

        } catch (error) {
            next(error)
        }
    }
    async takeProductDetails(req, res, next) {
        try {
            const productId = req.params.id
            console.log(productId);

            const response = await this.#productUseCase.takeProductDetails(productId);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, data: response.data })
            }
            return res.status(response.status).json({ message: response.message })

        } catch (error) {
            next(error)
        }
    }
}

export default ProductController;