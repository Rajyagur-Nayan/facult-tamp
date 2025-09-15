"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

type Student = {
  student_id: string;
  name: string;
  semester: number;
  division: string;
  gender: string;
};

type AttendanceStudent = {
  student_id: string;
  name: string;
  status: "P" | "A";
};

export default function StudentsAttendancePage() {
  const [semester, setSemester] = useState<number>(2);
  const [subject, setSubject] = useState<string>("dsa");
  const [date, setDate] = useState<string>("2025-09-13");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchStudents = async () => {
    const token = Cookies.get("access_token");
    if (!token) return alert("Token not found");

    try {
      setLoadingStudents(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/students/?semester=${semester}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      if (Array.isArray(data.students)) setStudents(data.students);
      else setStudents([]);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchAttendance = async () => {
    const token = Cookies.get("access_token");
    if (!token) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/attendance/live/?semester=${semester}&subject_id=1&date=${date}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      if (Array.isArray(data.students)) setAttendance(data.students);
      else setAttendance([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (students.length === 0) return;

    fetchAttendance();
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval);
  }, [students, semester, subject, date]);

  const getStatus = (student_id: string) => {
    const record = attendance.find((a) => a.student_id === student_id);
    return record ? record.status : "-";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8 drop-shadow-md">
          🎓 Students & Live Attendance
        </h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-8 items-center">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-28"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            onClick={fetchStudents}
            disabled={loadingStudents}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md transition"
          >
            {loadingStudents ? "Loading..." : "Load Students"}
          </button>

          <button
            onClick={fetchAttendance}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 shadow-md transition"
          >
            Refresh Attendance
          </button>
        </div>

        {/* Table */}
        {students.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  {[
                    "Student ID",
                    "Name",
                    "Semester",
                    "Division",
                    "Gender",
                    "Attendance",
                  ].map((col) => (
                    <th
                      key={col}
                      className="border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.student_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                      {s.student_id}
                    </td>
                    <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                      {s.name}
                    </td>
                    <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                      {s.semester}
                    </td>
                    <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                      {s.division}
                    </td>
                    <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                      {s.gender}
                    </td>
                    <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-white text-sm shadow ${
                          getStatus(s.student_id) === "P"
                            ? "bg-green-500 animate-pulse"
                            : getStatus(s.student_id) === "A"
                            ? "bg-red-500 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      >
                        {getStatus(s.student_id)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No students loaded yet. Pick semester and click{" "}
            <strong>Load Students</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
