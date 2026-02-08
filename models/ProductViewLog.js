import mongoose from "mongoose";

const ProductViewLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now },
});

export default mongoose.models.ProductViewLog || mongoose.model("ProductViewLog", ProductViewLogSchema);