import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import ProductViewLog from "@/models/ProductViewLog";

export async function POST(req) {
  try {
    await connectDB();

    const { productId, name } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(productId) || !name) {
      return new Response(JSON.stringify({ error: "Мэдээлэл буруу" }), { status: 400 });
    }

    // ✅ Шинэ бичлэг бүрийг хадгалах
    const log = await ProductViewLog.create({
      productId,
      name,
      viewedAt: new Date(),
    });

    return new Response(JSON.stringify(log), { status: 201 });
  } catch (err) {
    console.error("View log API error:", err);
    return new Response(JSON.stringify({ error: "Алдаа гарлаа" }), { status: 500 });
  }
}
export async function GET() {
  try {
    await connectDB();

    // Бүх viewlog-ийг буцаана, newest first
    const logs = await ProductViewLog.find()
      .sort({ viewedAt: -1 })
      .populate("productId", "productId"); // productId-ээс зөвхөн productId харуулна

    return new Response(JSON.stringify(logs), { status: 200 });
  } catch (err) {
    console.error("View log GET error:", err);
    return new Response(JSON.stringify({ error: "Алдаа гарлаа" }), { status: 500 });
  }
}
