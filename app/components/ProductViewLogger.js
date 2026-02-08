"use client";
import { useEffect } from "react";

export default function ProductViewLogger({ productId }) {
  useEffect(() => {
    const name = localStorage.getItem("name") || "Anonymous";

    fetch("/api/products/viewlog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, name }),
    }).catch(err => console.error("View log error:", err));
  }, [productId]);

  return null;
}