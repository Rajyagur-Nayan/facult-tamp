"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface TopicData {
  average_marks: number;
  students: { student_id: string; name: string; marks: number }[];
}

interface ResponseData {
  [semester: string]: {
    [topic: string]: TopicData;
  };
}

export default function ProgressPage() {
  const [semester, setSemester] = useState("");
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProgress = async (sem: string) => {
    if (!sem) return;

    setLoading(true);
    setData(null);

    try {
      const accessToken = Cookies.get("access_token");

      const res = await fetch(
        `http://127.0.0.1:8000/api/marks-by-topic/?semester=${sem}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken || ""}`,
          },
        }
      );

      const result = await res.json();

      if (result.status === "success") {
        if (!result.data[sem] || Object.keys(result.data[sem]).length === 0) {
          toast("Progress report for this semester is not ready yet.", {
            icon: "ℹ️",
            style: { background: "#fde047", color: "#333" },
          });
          setData({});
        } else {
          setData(result.data);
        }
      } else {
        toast.error("Failed to fetch data!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (semester) fetchProgress(semester);
  }, [semester]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 p-6 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-teal-300 dark:bg-teal-800 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-500 drop-shadow-md">
            📈 Student Progress Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Track progress by semester with interactive reports
          </p>
        </motion.div>

        {/* Semester Input */}
        <div className="flex justify-center mb-10">
          <input
            type="number"
            placeholder="Enter Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="px-5 py-3 rounded-xl w-2/3 sm:w-1/3
              border border-gray-300 dark:border-gray-600 
              bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
              text-gray-700 dark:text-gray-200 
              focus:outline-none focus:ring-4 focus:ring-blue-400/50 
              shadow-md"
          />
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-400 animate-pulse">
            Loading progress data...
          </p>
        )}

        {/* No data */}
        {!loading && data && Object.keys(data).length === 0 && (
          <p className="text-center text-red-500 dark:text-red-400 font-semibold mt-6">
            🚫 Progress report for this semester is not ready yet.
          </p>
        )}

        {/* Data cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {!loading &&
            data &&
            Object.keys(data).length > 0 &&
            data[semester] &&
            Object.entries(data[semester]).map(([topic, topicData], idx) => {
              const avg = topicData.average_marks;
              const progress = Math.min(100, Math.max(0, avg));

              return (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all cursor-pointer relative overflow-hidden group"
                >
                  {/* Glow background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200 dark:from-blue-900 dark:via-teal-800 dark:to-green-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                  {/* Title */}
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    {topic}
                  </h2>

                  {/* Progress Circle */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="10"
                          className="text-gray-200 dark:text-gray-700"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          stroke="url(#grad)"
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 50}
                          strokeDashoffset={
                            2 * Math.PI * 50 * (1 - progress / 100)
                          }
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-700"
                        />
                        <defs>
                          <linearGradient
                            id="grad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#14b8a6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600 dark:text-teal-400">
                          {avg.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
