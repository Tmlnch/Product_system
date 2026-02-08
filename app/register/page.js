"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.username || !form.password) {
      setError("Бүх талбарыг бөглөнө үү");
      return;
    }

    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Амжилттай бүртгэгдлээ");
        router.push("/login");
      } else {
        setError(data.message || "Бүртгэл хийхэд алдаа гарлаа");
      }
    } catch (err) {
      console.error(err);
      setError("Серверийн алдаа");
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm mx-auto mt-10"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Бүртгүүлэх</h1>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <input
        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Нэр"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Нэвтрэх нэр"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Нууц үг"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
      >
        Бүртгүүлэх
      </button>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">Бүртгэлтэй хэрэглэгч үү?</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-blue-500 hover:underline text-sm font-medium"
        >
          Нэвтрэх
        </button>
      </div>
    </form>
    </div>
  );
}