
import Review from '../../../infrastructure/database/models/productReview.js'
import Product from '../../../infrastructure/database/models/productModel.js';

class ReviewRepository {

    async updateProductRating(productId) {
        try {

            const ProductData = await Product.findById(productId)

            if (!ProductData) {
                throw {
                    status: 404,
                    message: `Product not found with ID: ${productId}`
                };
            };

            return ProductData.rating

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while updating product rating.'
            };
        }
    }
    async newReview(userId, productId, rating, comment, productRating) {
        try {
            const existingReview = await Review.findOne({ userId, productId });

            if (existingReview) {
                // Update review
                const newTotalValue = (productRating.total - existingReview.rating) + rating

                existingReview.rating = rating;
                existingReview.comment = comment;
                const review = await existingReview.save();

                const newRating = { count: productRating.count, total: newTotalValue }
                return { review, newRating }

            }
            const newReview = new Review({
                userId,
                productId,
                rating,
                comment,
            });

            const review = await newReview.save();
            const newRating = { count: productRating.count + 1, total: productRating.total + rating }
            return { review, newRating }

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while updating product rating.'
            };
        }
    }
    async saveProductRating(productId, newRating) {
        try {
            const product = await Product.findOneAndUpdate(
                { _id: productId },
                { $set: { rating: newRating } },
                { new: true } // return updated document
            );
            if (!product) {
                throw {
                    status: 404,
                    message: `Product not found.`
                };
            };
            return true

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while updating product rating.'
            };
        }
    }
    async takeReviews(productId, limit, page) {
        try {

            const pageSize = parseInt(limit, 10) || 10;
            const currentPage = parseInt(page, 10) || 1;

            const skip = (currentPage - 1) * pageSize;

            const reviews = await Review.find({ productId })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .populate("userId", "firstName lastName")
                .lean();

            const totalReviews = await Review.countDocuments({ productId });
            const totalPages = Math.ceil(totalReviews / pageSize);

            return {
                reviews,
                pagination: {
                    totalReviews,
                    totalPages,
                    currentPage,
                    pageSize,
                },
            }
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while take Review in repository.'
            };
        }
    }
    async deleteReview(reviewId, userId) {
        try {
            const review = await Review.findById(reviewId);
            if (!review) {
                throw { status: 404, message: "Review not found." };
            }
            // console.log(review);
            if (review.userId.toString() !== userId.toString()) {
                throw { status: 403, message: "You are not authorized to delete this review." };
            }
            const productId = review.productId;
            const oldRating = review.rating;

            await Review.findByIdAndDelete(reviewId);

            return {
                productId,
                oldRating
            }

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'An error occurred while take Review in repository.'
            };
        }
    }

}

export default ReviewRepository