import mongoose, { Model } from 'mongoose';

// Keep track of whether the model has been compiled
let User: Model<any>;

try {
  // Try to get existing model
  User = mongoose.model('User');
} catch {
  // Model doesn't exist, create new one
  const UserSchema = new mongoose.Schema({
    facebookId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });

  User = mongoose.model('User', UserSchema);
}

export default User; 