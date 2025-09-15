"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function Holidays() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [holidays, setHolidays] = useState<Record<string, any[]>>({});
  const token = Cookies.get("access_token");

  const fetchHolidays = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/holidays/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch holidays");
      const data = await res.json();

      const grouped: Record<string, any[]> = {};
      data.forEach((holiday: any) => {
        const month = new Date(holiday.date).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push({
          ...holiday,
          date: new Date(holiday.date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          }),
        });
      });
      setHolidays(grouped);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching holidays");
    }
  };

  useEffect(() => {
    fetchHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/holidays/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("File uploaded successfully!");
      setFile(null);
      fetchHolidays();
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 transition-colors">
      <Card className="max-w-6xl mx-auto shadow-2xl rounded-2xl border border-purple-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 backdrop-blur">
        {/* Header */}
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
          <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300">
            🌸 Holiday Calendar
          </CardTitle>
          <div className="flex gap-3">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="holiday-upload"
            />
            <label htmlFor="holiday-upload">
              <Button
                variant="outline"
                className="rounded-full border-purple-400 dark:border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-gray-800"
                asChild
              >
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  {file ? file.name : "Choose File"}
                </span>
              </Button>
            </label>
            {file && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Holidays Grid */}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(holidays).map(([month, list]) => (
              <div
                key={month}
                className="p-6 rounded-2xl shadow-md bg-gradient-to-tr from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600 hover:scale-[1.02] transition-transform"
              >
                <h4 className="font-extrabold text-lg text-center text-purple-700 dark:text-purple-300 mb-4 underline decoration-wavy">
                  {month}
                </h4>
                <ul className="space-y-3">
                  {list.map((holiday, index) => (
                    <li
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-xl shadow-sm border transition-colors ${
                        holiday.type === "National"
                          ? "bg-red-100/80 border-red-300 text-red-800 dark:bg-red-900/60 dark:border-red-700 dark:text-red-300"
                          : "bg-yellow-100/80 border-yellow-300 text-yellow-800 dark:bg-yellow-900/60 dark:border-yellow-700 dark:text-yellow-300"
                      }`}
                    >
                      <span className="font-medium">{holiday.name}</span>
                      <span className="font-bold">{holiday.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
