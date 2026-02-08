import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    manufactureDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    // imageUrl nemj ugsun
    imageUrl: { type: String, default: null }
  },
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);