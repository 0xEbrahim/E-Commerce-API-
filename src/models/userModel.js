import mongoose from "mongoose";
import bcrypt from "bcrypt";
import slugify from "slugify";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User's name is required"],
  },
  slug: {
    type: String,
    // required: true,
    lowercase: true,
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

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) next();
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    trim: true,
  });
  next();
});

export default mongoose.model("User", userSchema);
