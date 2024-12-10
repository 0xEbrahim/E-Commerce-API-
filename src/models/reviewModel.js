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
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 });

reviewSchema.methods.calcAverage = async function (id) {
  const stats = await this.aggregate([
    {
      $match: { product: id },
    },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$ratings" },
        nom: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(id, {
      ratingsAverage: stats[0].avg,
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
  await this.constructor.calcAverageRating(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRating(doc.product);
});

export default mongoose.model("Review", reviewSchema);
