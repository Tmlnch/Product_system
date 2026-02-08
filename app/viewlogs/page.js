"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function ViewLogsPage() {
  // View log-uudiin raw data (API-aas irne)
  const [logs, setLogs] = useState([]);

  // UI state: load hiij baigaa esehiig iltgene
  const [loading, setLoading] = useState(true);

  // UI state: aldaa garsan uyd haruulah message
  const [error, setError] = useState("");

  // Helper: localStorage-aas token avna
  const getToken = () => localStorage.getItem("token");

  // Init: token baigaa esehiig shalgaj, baival view log-iig unshina
  useEffect(() => {
    const token = getToken();

    // Token baihgui bol login ruu shiljine
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Function: /api/products/viewlog endpoint-ees log avna
    const load = async () => {
      try {
        // Loading state asna
        setLoading(true);
        setError("");

        // View log fetch hiine (JWT token header-t)
        const res = await fetch("/api/products/viewlog", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store", // caching hiihgui, urgelj shineer avna
        });

        // JSON parse hiine
        const data = await res.json();

        // Response ok bish bol error message set hiine
        if (!res.ok) {
          setError(data?.error || data?.message || "Log achaallakhad aldaa garlaa");
          setLogs([]);
          return;
        }

        // Hamgaalalt: data array bish bol empty array bolgono
        setLogs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError("Serveriin aldaa");
        setLogs([]);
      } finally {
        // Loading duusna
        setLoading(false);
      }
    };

    load();
  }, []);

  // Derived rows: UI-d zoriulj log object-iig zambaraatai bolgono
  const rows = useMemo(() => {
    return (Array.isArray(logs) ? logs : []).map((log) => {
      // productId ni populate hiigdsen object baih esvel string baih bolomjtoi
      const productIdText =
        typeof log.productId === "object" && log.productId
          ? log.productId.productId
          : log.productId;

      // Product detail ruu link hiih objectId
      const productObjectId =
        typeof log.productId === "object" && log.productId
          ? log.productId._id
          : log.productObjectId || null;

      return {
        _id: log._id,
        name: log.name || "-",
        viewedAt: log.viewedAt,
        productIdText: productIdText || "-",
        productObjectId: productObjectId ? String(productObjectId) : null,
      };
    });
  }, [logs]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👀 ViewLogs</h1>
            <p className="text-sm text-gray-500 mt-1">
              Хэн ямар бүтээгдэхүүнийг хэзээ үзсэнийг жагсаана
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              ← Нүүр хуудас
            </Link>
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Нийт: <span className="font-semibold text-gray-900">{rows.length}</span> лог
            </div>

            
            {loading && (
              <span className="text-sm text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                Ачаалж байна...
              </span>
            )}
            {!loading && error && (
              <span className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                {error}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="p-3 text-center font-semibold">Product ID</th>
                  <th className="p-3 text-center font-semibold">Хэрэглэгч</th>
                  <th className="p-3 text-center font-semibold">Хэзээ харсан</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      Одоогоор view log байхгүй байна
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r._id} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3 text-center">
                        {r.productObjectId ? (
                          <Link
                            href={`/products/${r.productObjectId}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {r.productIdText}
                          </Link>
                        ) : (
                          <span className="font-medium text-gray-800">{r.productIdText}</span>
                        )}
                      </td>

                      <td className="p-3 text-center text-gray-800">{r.name}</td>

                      <td className="p-3 text-center text-gray-700">
                        {r.viewedAt ? new Date(r.viewedAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}