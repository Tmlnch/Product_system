// Import necessary modules for file handling and NextJS
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    // Parse the incoming FormData request containing the image file
    const formData = await req.formData();
    
    // Extract the image file from FormData
    const file = formData.get("image");
    
    // Extract the productId from FormData
    const productId = formData.get("productId");

    // Validate that both file and productId are provided
    if (!file || !productId) {
      return new Response(
        JSON.stringify({ error: "Зураг болон бүтээгдэхүүний ID шаардлагатай" }),
        { status: 400 }
      );
    }

    // Validate that the uploaded file is actually a file
    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Зураг файл түрхий байх ёстой" }),
        { status: 400 }
      );
    }

    // Validate that the file is an image
    if (!file.type.startsWith("image/")) {
      return new Response(
        JSON.stringify({ error: "Зүгээр зургийн файл төрхий байх ёстой" }),
        { status: 400 }
      );
    }

    // Define the uploads directory path in the public folder for local storage
    const uploadsDir = join(process.cwd(), "public", "uploads");

    // Check if uploads directory exists, if not create it
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename using timestamp and original file name
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    
    // Create the full file path for saving in local storage
    const filepath = join(uploadsDir, filename);

    // Convert the uploaded file to a buffer and write it to local storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create the URL path for accessing the image from the database
    const imageUrl = `/uploads/${filename}`;

    // Connect to MongoDB database
    await connectDB();

    // Find the product by productId and update its imageUrl field
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      { imageUrl: imageUrl },
      { new: true } // Return the updated document
    );

    // Check if product exists
    if (!updatedProduct) {
      return new Response(
        JSON.stringify({ error: "Бүтээгдэхүүн олдсонгүй" }),
        { status: 404 }
      );
    }

    // Return success response with the updated product data
    return new Response(
      JSON.stringify({
        message: "Зураг амжилттай байршуулсан",
        product: updatedProduct,
      }),
      { status: 200 }
    );
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Upload error:", err);
    
    // Return error response if upload fails
    return new Response(
      JSON.stringify({
        error: "Зураг байршуулахад алдаа гарлаа",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
