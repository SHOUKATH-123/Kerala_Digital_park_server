import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  streetNumber: {
    type: String,
    required: true,
  },
  unitNumber: {
    type: String, 
  },
  suburb: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  region: {
    type: String, 
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  addressType: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  country: {
    type: String,
    default: 'New Zealand',
  }
}, {
  timestamps: true,
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
