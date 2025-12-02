"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");

  const handleDownload = () => {
    if (!url) return;
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
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download
      </button>
    </main>
  );
}
