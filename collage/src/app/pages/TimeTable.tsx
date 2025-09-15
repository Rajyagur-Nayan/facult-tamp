"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

interface Event {
  subject: string;
  teacher: string;
}

type DaySchedule = {
  [time: string]: Event | null;
};

type Schedule = {
  [D in Day]?: DaySchedule;
};

const displayDays: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TimeTableUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState<string>("1");
  const [division, setDivision] = useState<string>("A");

  const fetchTimeTable = async () => {
    const token = Cookies.get("access_token");
    if (!token) return alert("Token not found");

    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/timetable/${semester}/${division}/`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log("Fetch timetable response:", data);
      if (res.ok && data.status === "success" && data.data?.data) {
        setSchedule(data.data.data);
      } else {
        setSchedule({});
        toast.error("No timetable found for this selection");
      }
    } catch (err) {
      console.error(err);
      setSchedule({});
      toast.error("Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file!");
    const token = Cookies.get("access_token");
    if (!token) return toast.error("Token not found!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      toast.loading("Uploading file...", { id: "upload" });

      const res = await fetch("http://127.0.0.1:8000/api/generate-timetable/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // Do NOT set Content-Type, let browser set multipart/form-data
        body: formData,
      });

      const data = await res.json();
      console.log("Generate timetable response:", data);

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate timetable");
      }

      toast.success("Timetable uploaded successfully!", { id: "upload" });
      setFile(null);
      fetchTimeTable(); // Refresh timetable after upload
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error uploading timetable", { id: "upload" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeTable();
  }, [semester, division]);

  const timeSlotsFromData = Array.from(
    new Set(
      Object.values(schedule).flatMap((daySchedule) =>
        Object.keys(daySchedule || {})
      )
    )
  ).sort((a, b) => {
    const getHour = (timeStr: string) => {
      const hourPart = timeStr.match(/^(\d+)/);
      let hour = hourPart ? parseInt(hourPart[1], 10) : 0;
      if (timeStr.toLowerCase().includes("pm") && hour !== 12) hour += 12;
      if (timeStr.toLowerCase().includes("am") && hour === 12) hour = 0;
      return hour;
    };
    return getHour(a) - getHour(b);
  });

  const hasScheduleData = Object.keys(schedule).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-colors duration-500">
      <Card className="shadow-2xl rounded-2xl border-none">
        <CardContent className="p-6">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-white drop-shadow-md">
            🗓 Timetable Management
          </h2>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-5 border rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Filter Timetable
              </label>
              <div className="flex gap-4">
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <SelectItem key={s} value={s.toString()}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((d) => (
                      <SelectItem key={d} value={d}>
                        Division {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Upload New Timetable
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="block w-full text-sm text-gray-500 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                />
                <Button
                  onClick={handleUpload}
                  disabled={loading || !file}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-2"
                >
                  {loading ? "Processing..." : "Upload"}
                </Button>
              </div>
            </div>
          </div>

          {/* Timetable Display */}
          <h3 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-200">
            Semester {semester} - Division {division}
          </h3>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Loading timetable...
            </p>
          ) : !hasScheduleData ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No timetable data available for this selection.
            </p>
          ) : (
            <div className="overflow-x-auto border rounded-2xl shadow-lg bg-white dark:bg-gray-900">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 sticky left-0 bg-gray-100 dark:bg-gray-800 border-r z-10">
                      Time
                    </th>
                    {displayDays.map((day) => (
                      <th key={day} className="px-6 py-3 whitespace-nowrap">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlotsFromData.map((time) => (
                    <tr
                      key={time}
                      className="bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                      <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 border-r whitespace-nowrap">
                        {time}
                      </th>
                      {displayDays.map((day) => {
                        const event = schedule[day]?.[time];
                        return (
                          <td
                            key={`${day}-${time}`}
                            className="px-3 py-2 align-top"
                          >
                            {event ? (
                              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition">
                                <p className="font-semibold text-blue-800 dark:text-blue-200">
                                  {event.subject}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-xs">
                                  {event.teacher}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-300 dark:text-gray-600">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
