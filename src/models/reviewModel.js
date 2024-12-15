import mongoose from "mongoose";
import Product from "./productModel.js";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index({ product: 1, user: 1 });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name avatar",
  }).populate({
    path: "product",
    select: "_id",
  });
  next();
});

reviewSchema.statics.calcAverage = async function (id) {
  const stats = await this.aggregate([
    {
      $match: { product: id },
    },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$rating" },
        nom: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(id, {
      ratingsAverage: Math.round(stats[0].avg * 10) / 10,
      ratingsQuantity: stats[0].nom,
    });
  } else {
    await Product.findByIdAndUpdate(id, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverage(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverage(doc.product);
});

export default mongoose.model("Review", reviewSchema);
