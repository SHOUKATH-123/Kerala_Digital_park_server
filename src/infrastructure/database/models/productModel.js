import mongoose from 'mongoose';
const sizeSchema = new mongoose.Schema({
  name: { type: String },
  size: {
    width: { type: String },
    height: { type: String },
  },
}, { _id: false });

const paperSchema = new mongoose.Schema({
  name: { type: String },
  points: { type: [String] }, // or you can use [mongoose.Schema.Types.Mixed] if it's more than just strings
}, { _id: false });

const finishSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
}, { _id: false });

const cornersSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
}, { _id: false });


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
    subtitle: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      default: 0
    },
    size: { type: [sizeSchema], default: [] },
    paper: { type: [paperSchema], default: [] },
    finish: { type: [finishSchema], default: [] },
    corner: { type: [cornersSchema], default: [] },
    rating: {
      type: Object,
      default: {
        count: 0,
        total: 0
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
