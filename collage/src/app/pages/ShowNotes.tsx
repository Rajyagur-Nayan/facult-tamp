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

export default function FacultyPDFList() {
  const [pdfs, setPDFs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);

  const ACCESS_TOKEN = Cookies.get("access_token");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  const handleDownload = async (id: number) => {
    const ACCESS_TOKEN = Cookies.get("access_token"); // your token
    const downloadUrl = `http://127.0.0.1:8000/api/get-all-pdfs/?download=${id}`;

    try {
      const res = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`, // include auth header
        },
      });

      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      // Optional: get filename from headers
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
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          📚 Uploaded PDFs
        </h1>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-200 text-center">
            Loading PDFs...
          </p>
        ) : pdfs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No PDFs available.
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
