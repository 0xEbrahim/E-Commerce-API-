import mongoose from "mongoose";
import slugify from "slugify";

var categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

export default mongoose.model("Category", categorySchema);
