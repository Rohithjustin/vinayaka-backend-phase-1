const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressLine1: String,
  addressLine2: String,
  isDefault: { type: Boolean, default: false },
  location: {
    type: {
      type: String, enum: ['Point'], default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

const deviceInfoSchema = new mongoose.Schema({
  deviceToken: String
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  fullname: { type: String, default: '' },
  profilePicture: { type: String },
  addresses: [addressSchema],
  role: { type: String, enum: ['customer', 'shopOwner', 'admin'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  deviceInfo: deviceInfoSchema
});


userSchema.index({ 'addresses.location': '2dsphere' });

module.exports = mongoose.model('User', userSchema);
