import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "product id is required"],
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", function (next) {
  let total = 0;
  for (let i = 0; i < this.items.length; i++) {
    total = total + this.items[i].price * this.items[i].quantity;
  }
  this.totalPrice = total;
  next();
});

export default mongoose.model("Cart", cartSchema);
