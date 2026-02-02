import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Серверийн алдаа" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    // frontend-ees JSON body ilgeesen medeelliig avch baina
    const { productId, manufactureDate, expiryDate, imageUrl } = await req.json();

    // shaardlagatai medeelliig shalgah
    if (!productId || !manufactureDate || !expiryDate) {
      return new Response(JSON.stringify({ error: "Мэдээлэл дутуу" }), { status: 400 });
    }

    // ognoonuudiig shalgah
    if (new Date(expiryDate) <= new Date(manufactureDate)) {
      return new Response(JSON.stringify({ error: "Дуусах огноо буруу байна" }), { status: 400 });
    }

    // shineer product uusgeh
    const product = await Product.create({ productId, manufactureDate, expiryDate, imageUrl });

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Бүтээгдэхүүн нэмэхэд алдаа гарлаа" }), { status: 500 });
  }
}