import crypto from "crypto";
import otpGenerator from "otp-generator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import slugify from "slugify";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      default: undefined,
    },

    name: {
      type: String,
      required: [true, "User's name is required"],
    },
    slug: {
      type: String,
      // required: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
    email: {
      type: String,
      required: [true, "User's email is required"],
      unique: true,
    },
    emailConfirmationToken: {
      type: String,
      default: undefined,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    emailTokenExpires: {
      type: Date,
      default: undefined,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: {
      type: String,
      default: undefined,
    },
    passwordResetTokenExpires: {
      type: Date,
      default: undefined,
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
    reactiveBefore: {
      type: Date,
    },
    lastOnline: {
      type: Date,
      default: new Date("1990-01-01"),
    },
    twoStepAuth: {
      type: Boolean,
      default: false,
    },
    OTP: {
      type: String,
      default: undefined,
    },
    OTPExpires: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true, toJSON: true, toObject: true, virtuals: true }
);
userSchema.index({ slug: 1 });

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
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
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "user",
  localField: "_id",
});

userSchema.methods.createEmailConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const encoded = crypto.createHash("sha256").update(token).digest("hex");
  this.emailConfirmationToken = encoded;
  this.emailTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const encoded = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetToken = encoded;
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.methods.passwordChangedAfter = function (JWT_Time) {
  return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > JWT_Time;
};

userSchema.methods.matchPassword = async (candiPassword, password) => {
  return await bcrypt.compare(candiPassword, password);
};

userSchema.methods.createOTP = function () {
  const otp = otpGenerator.generate(8, {
    upperCaseAlphabets: false,
    specialChars: true,
  });
  const encrypted = crypto.createHash("sha256").update(otp).digest("hex");
  this.OTP = encrypted;
  this.OTPExpires = Date.now() + 10 * 60 * 1000;
  return otp;
};
export default mongoose.model("User", userSchema);
