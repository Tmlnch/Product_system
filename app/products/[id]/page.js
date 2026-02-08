import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";
import Link from "next/link";
import ProductViewLogger from "../../components/ProductViewLogger"; // Client Component

export default async function ProductDetail({ params }) {
  const { id } = await params; // ✅ Next 16 sync-dynamic params fix

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-xl font-semibold text-gray-900">Буруу Product ID</h1>
            <p className="text-gray-600 mt-2">Оруулсан ID буруу байна.</p>
            <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">
              ← Буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  try {
    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-xl font-semibold text-gray-900">Бүтээгдэхүүн олдсонгүй</h1>
              <p className="text-gray-600 mt-2">Та өөр бүтээгдэхүүн сонгоно уу.</p>
              <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">
                ← Буцах
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100">
        {/* ✅ 2 талаас margin + төвлөрсөн */}
        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* Header card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Бүтээгдэхүүн дэлгэрэнгүй</h1>
              <p className="text-sm text-gray-500 mt-1">
                Product ID: <span className="font-semibold text-gray-700">{product.productId}</span>
              </p>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              ← Жагсаалт руу
            </Link>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Зураг</h2>

              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.productId}
                  className="w-full h-64 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-64 rounded-lg border flex items-center justify-center text-gray-400">
                  Зураг байхгүй
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Мэдээлэл</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-100 p-4">
                  <div className="text-xs text-gray-500">Product ID</div>
                  <div className="text-lg font-semibold text-gray-900">{product.productId}</div>
                </div>

                <div className="rounded-lg border border-gray-100 p-4">
                  <div className="text-xs text-gray-500">ObjectId</div>
                  <div className="text-sm font-mono text-gray-800 break-all">
                    {product._id.toString()}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 p-4">
                  <div className="text-xs text-gray-500">Үйлдвэрлэсэн огноо</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(product.manufactureDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 p-4">
                  <div className="text-xs text-gray-500">Дуусах огноо</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-5 text-xs text-gray-500">
                Тайлбар: Энэ хуудсанд орсон тохиолдолд View Log автоматаар үүснэ.
              </div>

              {/* ✅ View log */}
              <ProductViewLogger productId={product._id.toString()} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-xl font-semibold text-gray-900">Серверийн алдаа</h1>
            <p className="text-gray-600 mt-2">Түр хүлээгээд дахин оролдоно уу.</p>
            <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">
              ← Буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }
}