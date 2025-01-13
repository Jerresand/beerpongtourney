// @ts-check
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/** @type {import('mongoose').Schema} */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
    },
    profilePicture: String,
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark',
      },
      notifications: {
        type: Boolean,
        default: false,
      },
      language: {
        type: String,
        enum: ['en', 'es', 'fr'],
        default: 'en',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
/** @this {import('mongoose').Document & { password: string }} */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(/** @type {string} */(this.password), salt);
    next();
  } catch (error) {
    /** @type {import('mongoose').CallbackError} */
    const err = error instanceof Error ? error : new Error('Unknown error during password hashing');
    next(err);
  }
});

// Method to compare password
/** @param {string} candidatePassword */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = { User }; 