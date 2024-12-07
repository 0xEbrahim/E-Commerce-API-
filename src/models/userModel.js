import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User's name is required"],
  },
  slug: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "User's email is required"],
    unique: true,
  },
  emailConfirmationToken: {
    type: String,
    default: null,
  },
  emailConfirmed: {
    type: String,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetTokenExpires: {
    type: Date,
    default: null,
  },
  passwordChangedAt: {
    type: Date,
  },
  avatar: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

userSchema.index({ slug: 1 });

export default mongoose.model("User", userSchema);
