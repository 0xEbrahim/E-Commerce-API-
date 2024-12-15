import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    subImages: [
      {
        type: String,
      },
    ],
    ratingsAverage: {
      type: Number,
      default: 0.0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0.0,
    },
  },
  {
    toJSON: true,
    toObject: true,
    timestamps: true,
    virtuals: true,
  }
);
productSchema.set("toObject", { getters: true });

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

export default mongoose.model("Product", productSchema);
