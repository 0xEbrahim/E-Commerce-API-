import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import slugify from "slugify";

const userSchema = new mongoose.Schema(
  {
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
    emailTokenExpires: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
      select: false,
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
  },
  { timestamps: true, toJSON: true }
);
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

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.createEmailConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const encoded = crypto.createHash("sha256").update(token).digest("hex");
  this.emailConfirmationToken = encoded;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.methods.emailConfirmationTokenExpired = function () {
  return Date.now() > this.emailTokenExpires;
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const encoded = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetToken = encoded;
  this.emailTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

export default mongoose.model("User", userSchema);
