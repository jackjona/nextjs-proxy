"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    if (!url) return;
    setLoading(true); 
    window.location.href = `/api/download?url=${encodeURIComponent(url)}`;

  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Proxy Download App</h1>
      <input
        type="text"
        placeholder="Enter file URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-md p-2 border rounded mb-4"
      />
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Downloading..." : "Download"}
      </button>

      {loading && (
        <div className="mt-4 flex items-center space-x-2 text-gray-600">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Preparing download...</span>
        </div>
      )}
    </main>
  );
}
