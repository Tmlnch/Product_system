"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // Name (useriin ner) localStorage-aas avna
  const [name, setName] = useState("");

  // Product list (API-aas irsen buteegdehuunuud)
  const [products, setProducts] = useState([]);

  // Form fields
  const [productId, setProductId] = useState("");
  const [mDate, setMDate] = useState(""); // manufactureDate
  const [eDate, setEDate] = useState(""); // expiryDate

  // UI error message
  const [error, setError] = useState("");

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // Helper: localStorage-aas JWT token avna
  const getToken = () => localStorage.getItem("token");

  // Init: token + name baigaa esehiig shalgaj, baival products unshina
  useEffect(() => {
    const token = getToken();
    const storedName = localStorage.getItem("name");

    // Hervee token esvel name baihgui bol login ruu shiljine
    if (!token || !storedName) {
      window.location.href = "/login";
      return;
    }

    // LocalStorage deer bga name-iig state ruu oruulna
    setName(storedName);

    // Product list avna
    loadProducts();
  }, []);

  // Function: product list-iig /api/products endpoint-ees avch state ruu hiine
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();

      // Hamgaalalt: data array bish bol empty array bolgono
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  // Function: product nemeh (imageUrl bol uploadedImageUrl-iig ashiglaj bolno)
  const addProduct = async () => {
    // Basic validation
    if (!productId || !mDate || !eDate) {
      setError("Buh talbaryg boglono uu");
      return;
    }

    // Date validation: expiryDate ni manufactureDate-aas hoish baih yostoi
    if (new Date(eDate) <= new Date(mDate)) {
      setError("Duusah ognoo buruu baina");
      return;
    }

    setError("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          productId,
          manufactureDate: mDate,
          expiryDate: eDate,
          imageUrl: uploadedImageUrl || null,
        }),
      });

      const data = await res.json();

      // Amjilttai bol form-iig tseverleed list-iig dahin unshina
      if (res.status === 201) {
        setProductId("");
        setMDate("");
        setEDate("");
        setImageFile(null);
        setUploadedImageUrl("");
        loadProducts();
      } else {
        setError(data.error || "Aldaa garlaa");
      }
    } catch (err) {
      console.error(err);
      setError("Serveriin aldaa");
    }
  };

  // Function: file input-oos zurag songoh uyd validate hiine
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    // Zuvhun image file songoson esehiig shalgana
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setError("");
    } else {
      setImageFile(null);
      setError("Zuvhun zurag file songono uu");
    }
  };

  // Function: songoson zurgiig server ruu upload hiij, imageUrl butsaaj avna
  const handleImageUpload = async () => {
    // Upload hiihiin umnu productId + imageFile zaaval baih yostoi
    if (!imageFile || !productId) {
      setError("Product ID bolon zurag shaardlagatai");
      return;
    }

    setUploading(true);

    try {
      // multipart/form-data bolgoh
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("productId", productId);

      // Upload endpoint ruu yavuulna
      const res = await fetch("/api/products/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const data = await res.json();

      // Amjilttai bol imageUrl-iig state ruu hadgalna
      if (res.status === 200) {
        setUploadedImageUrl(data.product.imageUrl);
        setImageFile(null);
        setError("");
        alert("Zurag amjilttai bairshuulsan");
      } else {
        setError(data.error || "Zurag bairshuulahad aldaa garlaa");
      }
    } catch (err) {
      console.error(err);
      setError("Serveriin aldaa");
    } finally {
      setUploading(false);
    }
  };

  // Function: logout hiij localStorage-aas medeelliig ustgaad login ruu shiljine
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📦 Product System</h1>
            <p className="text-sm text-gray-500 mt-1">Бүтээгдэхүүний бүртгэл ба хяналт</p>
          </div>

         <div className="flex items-center gap-4">
  <div className="text-right">
    <div className="text-xs text-gray-500">Нэвтэрсэн хэрэглэгч</div>
    <div className="font-semibold text-gray-900">{name}</div>
  </div>
  <Link
    href="/viewlogs"
    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
  >
    View Logs
  </Link>

  <button
    onClick={logout}
    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
  >
    Гарах
  </button>
</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Бүтээгдэхүүн нэмэх</h2>
            {error && (
              <span className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                {error}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Product ID</label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Жишээ: P011"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Зураг файл</label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 bg-white"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Үйлдвэрлэсэн огноо</label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                value={mDate}
                onChange={(e) => setMDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Дуусах огноо</label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                value={eDate}
                onChange={(e) => setEDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              {imageFile && (
                <button
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {uploading ? "Байршуулж байна..." : "Зураг байршуулах"}
                </button>
              )}

              {uploadedImageUrl && (
                <div className="flex items-center gap-3">
                  <img
                    src={uploadedImageUrl}
                    alt="preview"
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                  <span className="text-sm text-green-600 font-medium">✓ Зураг бэлэн</span>
                </div>
              )}
            </div>

            <button
              onClick={addProduct}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
            >
              Бүтээгдэхүүн нэмэх
            </button>
          </div>
        </div>

       
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Бүтээгдэхүүний жагсаалт</h2>
            <p className="text-sm text-gray-500 mt-1">ID дээр дарж дэлгэрэнгүй рүү орно</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
             
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="p-3 text-center font-semibold">ID</th>
                  <th className="p-3 text-center font-semibold">Үйлдвэрлэсэн</th>
                  <th className="p-3 text-center font-semibold">Дуусах</th>
                  <th className="p-3 text-center font-semibold">Зураг</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-gray-50 transition">
            
                      <td className="p-3 text-center">
                        <Link
                          href={`/products/${p._id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {p.productId}
                        </Link>
                      </td>

                      <td className="p-3 text-center text-gray-700">
                        {new Date(p.manufactureDate).toLocaleDateString()}
                      </td>

                      <td className="p-3 text-center text-gray-700">
                        {new Date(p.expiryDate).toLocaleDateString()}
                      </td>

                    
                      <td className="p-3 text-center">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.productId}
                            className="w-12 h-12 object-cover rounded-lg border mx-auto"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-6 text-center text-gray-500" colSpan={4}>
                      Бүтээгдэхүүн олдсонгүй
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}