"use client";
import { useState, useEffect } from "react";
import styles from "./Home.module.css"; 

export default function Home() {

// ❌ WITHOUT useState - data lost after render
// function Home() {
//   let productId = "";
// When page re-renders, productId resets to ""!
// }
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [mDate, setMDate] = useState("");
  const [eDate, setEDate] = useState("");
  const [error, setError] = useState("");
  // image file hadgalah state
  const [imageFile, setImageFile] = useState(null);
  // image upload hiij baigaa esehiig hadgalah state
  const [uploading, setUploading] = useState(false);
  // image URL hadgalah state
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addProduct = async () => {
    if (!productId || !mDate || !eDate) {
      setError("Бүх талбарыг бөглөнө үү");
      return;
    }
    if (new Date(eDate) <= new Date(mDate)) {
      setError("Дуусах огноо буруу байна");
      return;
    }
    setError("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          manufactureDate: mDate,
          expiryDate: eDate,
          // upload hiisen bol image URL oruulna
          imageUrl: uploadedImageUrl || null,
        }),
      });

      if (res.status === 201) {
        setProductId("");
        setMDate("");
        setEDate("");
        // amjilttai product uusgesen daraa image file, URL arilgah
        setImageFile(null);
        setUploadedImageUrl("");
        loadProducts();
      } else {
        const data = await res.json();
        setError(data.error || "Алдаа гарлаа");
      }
    } catch (err) {
      console.error(err);
      setError("Серверийн алдаа");
    }
  };

  // image file songoh
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setError("");
    } else if (file) {
      setError("заавал зураг файл байх ёстой");
      setImageFile(null);
    }
  };

  // imageFile state-s avch server ruu ilgeene
  const handleImageUpload = async () => {
    // Validate that an image file is selected and productId is provided
    if (!imageFile || !productId) {
      setError("Зураг сонгож, Product ID оруулна уу");
      return;
    }

    // Set uploading state to true to show loading feedback
    setUploading(true);
    
    try {
      // Create FormData to send the image file and productId
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("productId", productId);

      // Send the image upload request to the server
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      // Parse response data from the server
      const data = await res.json();

      if (res.status === 200) {
        // Extract and store the image URL from successful response
        setUploadedImageUrl(data.product.imageUrl);
        // Clear the image file after successful upload
        setImageFile(null);
        setError("");
        // Show success message to user
        alert("Зураг амжилттай байршуулсан");
      } else {
        // Show error message if upload failed
        setError(data.error || "Зураг байршуулахад алдаа гарлаа");
      }
    } catch (err) {
      console.error(err);
      setError("Серверийн алдаа");
    } finally {
      // Reset uploading state after upload completes
      setUploading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>📦 Product System</h1>

      <div className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label>Product ID:</label>
          <input
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Үйлдвэрлэсэн огноо:</label>
          <input
            type="date"
            value={mDate}
            onChange={(e) => setMDate(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Дуусах хугацаа:</label>
          <input
            type="date"
            value={eDate}
            onChange={(e) => setEDate(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Бүтээгдэхүүний зураг:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
          />
          {imageFile && <p style={{ fontSize: "12px", color: "#666" }}>Сонгосон: {imageFile.name}</p>}
        </div>

        {imageFile && (
          <button 
            className={styles.button} 
            onClick={handleImageUpload}
            disabled={uploading}
          >
            {uploading ? "Байршуулаж байна..." : "Зураг байршуулах"}
          </button>
        )}

        {uploadedImageUrl && (
          <div className={styles.inputGroup}>
            <p style={{ color: "green", fontWeight: "bold" }}>✓ Зураг байршуулсан</p>
            <img 
              src={uploadedImageUrl} 
              alt="Preview" 
              style={{ maxWidth: "150px", maxHeight: "150px", marginTop: "10px" }}
            />
          </div>
        )}

        <button className={styles.button} onClick={addProduct}>Бүтээгдэхүүн нэмэх</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Үйлдвэрлэсэн огноо</th>
            <th>Дуусах огноо</th>
            <th>Зураг</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p._id}>
                <td>{p.productId}</td>
                <td>{new Date(p.manufactureDate).toLocaleDateString()}</td>
                <td>{new Date(p.expiryDate).toLocaleDateString()}</td>
                <td>
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.productId}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#999" }}>Зураг байхгүй</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>Бүтээгдэхүүн олдсонгүй</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}