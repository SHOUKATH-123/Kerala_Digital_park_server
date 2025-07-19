import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    brand: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      default: 0
    },
    rating: {
      type: Object,
      default: {
        count:0,
        total:0
      }
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    isListed: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
