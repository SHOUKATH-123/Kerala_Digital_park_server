import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        size: { type: Object, default: null },
        paper: { type: Object, default: null },
        finish: { type: Object, default: null },
        corner: { type: Object, default: null },
        userImage:[{type:String}],
        title:{type:String,default:''},
        content:{type:String,default:''}
      },
    ],
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address', 
      default: null,
    },
    paymentMethod: {
      type: String,
      default: ''
    },
    paymentResult: {
      id: { type: String, default: '' },
      status: { type: String, default: '' },
      update_time: { type: String, default: '' },
      email_address: { type: String, default: '' },

    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    appliedCoupon:{
        type:String,
        default:''
    },
    discountAmount:{
       type:Number,
       default:0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Create', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Create',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
