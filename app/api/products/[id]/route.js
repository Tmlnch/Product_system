import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ViewLog from "@/models/ProductViewLog";
import { verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    // 🔐 Token-аар хэрэглэгчийг шалгах
    const user = verifyToken(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    // 📝 Log нэмэх
    await ViewLog.create({
      productId: product._id,
      userId: user.id
    });

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.error("GET /api/products/[id] error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}