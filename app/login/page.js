"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        router.push("/");
      } else {
        setError(data.message || "Нэвтрэхэд алдаа гарлаа");
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
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Нэвтрэх</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

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
          Нэвтрэх
        </button>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">Бүртгэлгүй юу?</p>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-blue-500 hover:underline text-sm font-medium"
          >
            Бүртгүүлэх
          </button>
        </div>
      </form>
    </div>
  );
}