import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  userType: { type: String, enum: ['buyer', 'seller'], required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  images: {
    type: [String],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.every((url) => typeof url === "string");
      },
      message: "Images must be an array of strings",
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Apartment', 'Villa', 'Cottage', 'House'],
  },
  sellerInfo: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      userId: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    }),
    required: true,
  },
  sold: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});


export const Product = mongoose.model('Product', productSchema, 'products');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
});

export const Order = mongoose.model("Order", orderSchema);