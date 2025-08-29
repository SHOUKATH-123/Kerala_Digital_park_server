import mongoose from "mongoose";



class ReviewUseCase {
    #reviewRepository
    constructor(reviewRepository) {
        this.#reviewRepository = reviewRepository
    }

    async addNewReview(reviewData, userId) {
        try {

            const { productId, rating, comment } = reviewData

            const isValidId = mongoose.Types.ObjectId.isValid(productId);
            if (!isValidId) {
                throw {
                    status: 400,
                    message: `Invalid product Id: ${productId}`
                };
            }
            const NewRating = parseInt(rating);
            if (isNaN(NewRating) || NewRating < 1 || NewRating > 5) {
                throw {
                    status: 400,
                    message: `Invalid rating: ${rating}. Rating must be between 1 and 5.`
                };
            }

            const productRating = await this.#reviewRepository.updateProductRating(productId);

            const addReview = await this.#reviewRepository.newReview(userId, productId, NewRating, comment, productRating);

            await this.#reviewRepository.saveProductRating(productId, addReview.newRating);

            return {
                status: 200,
                message: "Review created successfully.",
            }


        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in review useCase.'
            };
        }
    }
    async takeReviews(reqData) {
        try {

            const { productId, limit, page } = reqData;
            const isValidId = mongoose.Types.ObjectId.isValid(productId);
            if (!isValidId) {
                throw {
                    status: 400,
                    message: `Invalid product Id: ${productId}`
                };
            }

            const takeReviews=await this.#reviewRepository.takeReviews(productId, limit, page)

           return {
                status: 200,
                data:takeReviews,
                message: "Review take successfully.",
            }
            

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in takeReview useCase.'
            };
        }
    }
    async deleteReview(reviewId,userId){
        try {

            const isValidId = mongoose.Types.ObjectId.isValid(reviewId);
            if (!isValidId) {
                throw {
                    status: 400,
                    message: `Invalid Id: ${reviewId}`
                };
            }

            const deleteReviewData= await this.#reviewRepository.deleteReview(reviewId,userId);

            const productRating = await this.#reviewRepository.updateProductRating(deleteReviewData.productId);

            const newRating={count:productRating.count-1,total:productRating.total-deleteReviewData.oldRating}

            await this.#reviewRepository.saveProductRating(deleteReviewData.productId, newRating);
            
            return {
                status:200,
                message:'deleted your review.'
            }
            
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred in delete Review useCase.'
            };
        }
    }

}

export default ReviewUseCase