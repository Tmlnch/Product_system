"use client";
import { useState, useEffect } from "react";
import styles from "./Home.module.css"; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [mDate, setMDate] = useState("");
  const [eDate, setEDate] = useState("");
  const [error, setError] = useState("");

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
        }),
      });

      if (res.status === 201) {
        setProductId("");
        setMDate("");
        setEDate("");
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

        <button className={styles.button} onClick={addProduct}>Нэмэх</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Үйлдвэрлэсэн огноо</th>
            <th>Дуусах огноо</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p._id}>
                <td>{p.productId}</td>
                <td>{new Date(p.manufactureDate).toLocaleDateString()}</td>
                <td>{new Date(p.expiryDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>Бүтээгдэхүүн олдсонгүй</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}