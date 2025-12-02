"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [fileId, setFileId] = useState("");
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
        placeholder="Enter file ID..."
        value={fileId}
        onChange={(e) => {
          const id = e.target.value.trim();
          setFileId(id);
          setUrl(id ? `https://pixeldrain.com/api/file/${id}?download` : "");
        }}
        className="w-full max-w-md p-2 border rounded mb-4"
      />

      <input
        type="url"
        placeholder="Enter file URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-md p-2 border rounded mb-4"
        required
      />

      <button
        onClick={handleDownload}
        disabled={loading || !url}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Downloading..." : "Download"}
      </button>
    </main>
  );
}
