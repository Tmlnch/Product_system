import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    // frontend-ees FormData body ilgeesen
    const formData = await req.formData();
    
    // frontend-ees irsen zurag file-iig avch baina
    const file = formData.get("image");
    
    // frontend-ees irsen productId-iig avch baina
    const productId = formData.get("productId");

    // zurag nemehed shaardagdah heregtei medeelliig shalgah
    if (!file || !productId) {
      return new Response(
        JSON.stringify({ error: "Зураг болон бүтээгдэхүүний ID шаардлагатай" }),
        { status: 400 }
      );
    }

    // irsen zuraag file esehiig shalgah
    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Заавал файл байх ёстой" }),
        { status: 400 }
      );
    }

    // irsen file zurag esehiig shalgah
    if (!file.type.startsWith("image/")) {
      return new Response(
        JSON.stringify({ error: "заавал зураг файл байх ёстой" }),
        { status: 400 }
      );
    }

    // nemj baigaa zurgaa local ruu hadgalah zam
    const uploadsDir = join(process.cwd(), "public", "uploads");

    // uploads folder baigaa uguig shalgah, baihgui bol shineer uusgeh
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // davtagdahgui filename uusgeh
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    
    // file-iig hadgalah buren zam
    const filepath = join(uploadsDir, filename);

    // file-iig buffer bolgon oorchlon local ruu hadgalah
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // database-d hadgalah zuragnii URL
    const imageUrl = `/uploads/${filename}`;

    // database-tai holbogdoh
    await connectDB();

    // productId-aar product olj imageUrl talbariig shinechleh
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      { imageUrl: imageUrl },
      { new: true }
    );

    // product oldson esehiig shalgah
    if (!updatedProduct) {
      return new Response(
        JSON.stringify({ error: "Бүтээгдэхүүн олдсонгүй" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Зураг амжилттай байршуулсан",
        product: updatedProduct,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    
    return new Response(
      JSON.stringify({
        error: "Зураг байршуулахад алдаа гарлаа",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
