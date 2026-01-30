import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    manufactureDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    // Added imageUrl field to store the path/link of the uploaded image in local storage
    imageUrl: { type: String, default: null },
  },
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);