// app/faculty-pdf/page.tsx
"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

interface PDF {
  id: number;
  title: string;
  file: string;
  uploaded_at: string;
}

export default function FacultyPDF() {
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pdfs, setPDFs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(false);

  const ACCESS_TOKEN = Cookies.get("access_token"); // your token

  const fetchPDFs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-all-pdfs/", {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch PDFs");
      const data: PDF[] = await res.json();
      setPDFs(data);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !file) {
      toast.error("Please provide a topic and PDF file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", topic);
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload-pdf/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("PDF uploaded successfully!");
      setTopic("");
      setFile(null);

      fetchPDFs(); // refresh PDF list
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    const downloadUrl = `http://127.0.0.1:8000/api/get-all-pdfs/?download=${id}`;
    try {
      const res = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const disposition = res.headers.get("content-disposition");
      let filename = "download.pdf";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <Toaster />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
          📄 Faculty PDF Upload
        </h1>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter PDF topic"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Select PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>

        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          📚 Uploaded PDFs
        </h2>

        {pdfs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No PDFs uploaded yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {pdfs.map((pdf) => (
              <li
                key={pdf.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {pdf.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Uploaded at: {new Date(pdf.uploaded_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(pdf.id)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Download PDF
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
