"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

type Holiday = {
  id: number;
  name: string;
  date: string;
  type: string;
};

export default function ShowHolidays() {
  const [holidays, setHolidays] = useState<Record<string, Holiday[]>>({});
  const token = Cookies.get("access_token");

  const fetchHolidays = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/holidays/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch holidays");
      const data: Holiday[] = await res.json();

      const grouped: Record<string, Holiday[]> = {};
      data.forEach((holiday) => {
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
  }, []);

  return (
    <Card className="max-w-6xl mx-auto mt-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-none shadow-2xl transition-colors duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-extrabold text-gray-800 dark:text-white drop-shadow-md">
          🎉 Holiday Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(holidays).length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No holidays found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(holidays).map(([month, list]) => (
              <div
                key={month}
                className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <h4 className="font-bold text-center text-xl md:text-2xl text-blue-600 dark:text-teal-400 mb-5">
                  {month}
                </h4>
                <ul className="space-y-3">
                  {list.map((holiday) => (
                    <li
                      key={holiday.id}
                      className={`flex justify-between items-center p-3 rounded-lg font-medium shadow-sm transition-colors duration-300 ${
                        holiday.type === "National"
                          ? "bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/40"
                          : "bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-800/40"
                      }`}
                    >
                      <span className="text-gray-700 dark:text-gray-200">
                        {holiday.name}
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {holiday.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
