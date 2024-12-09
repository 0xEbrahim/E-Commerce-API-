import mongoose from "mongoose";

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
    timestamps: true,
    toJSON: true,
    toObject: true,
  }
);

export default mongoose.model("Product", productSchema);
