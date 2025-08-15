


class ReviewUseCase{
    #reviewRepository
    constructor(reviewRepository){
         this.#reviewRepository = reviewRepository
    }

    async addNewReview(reviewData,userId){
        try {
           
            const {productId,rating,comment}=reviewData

             

        } catch (error) {
            
        }
    }
    
}

export default ReviewUseCase