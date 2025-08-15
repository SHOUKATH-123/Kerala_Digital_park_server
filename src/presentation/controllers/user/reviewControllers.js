


class ReviewController{
    #reviewUseCase
    constructor(reviewUseCase){
        this.#reviewUseCase=reviewUseCase
    }

    async addNewReview(req,res,next){
        try {
           
            const userId=req.user
            
            const response= await this.#reviewUseCase.addNewReview(req.body,userId);

            if (response.status == 200) {
                return res.status(200).json({ message: response.message })
            }

            return res.status(response.status).json({ message: response.message });
            
        } catch (error) {
            next(error)
        }
    }
}

export default ReviewController