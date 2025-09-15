"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import toast from "react-hot-toast";

type Student = {
  student_id: string;
  name: string;
  gender: string;
  attendance: boolean | null; // true=P, false=A, null=empty
};

export default function AttendancePage() {
  const [semester, setSemester] = useState("2");
  const [students, setStudents] = useState<Student[]>([]);
  const [subjectId] = useState(1); // subject selection
  const [attendanceDate, setAttendanceDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  // Fetch students from API
  const fetchStudents = async () => {
    const token = Cookies.get("access_token");
    if (!token) return alert("Token not found");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/students/?semester=${semester}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to fetch students:", err);
        return;
      }

      const data = await res.json();

      const initialized = data.students.map((s: any) => ({
        ...s,
        attendance: null,
      }));

      setStudents(initialized);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle attendance
  const toggleAttendance = (student_id: string, status: boolean) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.student_id === student_id ? { ...s, attendance: status } : s
      )
    );
  };

  // Save attendance to API
  const saveAttendance = async () => {
    const token = Cookies.get("access_token");
    if (!token) return alert("Token not found");

    const updates = students.map((s) => ({
      student_id: s.student_id,
      status: s.attendance ?? false,
    }));

    const payload = {
      semester: Number(semester),
      subject_id: subjectId,
      date: attendanceDate,
      updates,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/attendance/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        toast.error("Error updating attendance");
      } else {
        toast.success("Attendance saved successfully!");
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
      toast.error("Error updating attendance");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <Card className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 max-w-6xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 p-6">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            📘 Semester {semester} Attendance
          </CardTitle>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="5">Semester 5</option>
            </select>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            />
            <Button
              onClick={fetchStudents}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Load Students
            </Button>
            <Button
              onClick={saveAttendance}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Attendance
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700">
                <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                  Enrollment
                </TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                  Name
                </TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                  Gender
                </TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-200 text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow
                  key={s.student_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <TableCell>{s.student_id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.gender}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-3">
                      <Button
                        variant={s.attendance === true ? "default" : "outline"}
                        className={`px-4 py-1 text-sm rounded-full ${
                          s.attendance === true
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        onClick={() => toggleAttendance(s.student_id, true)}
                      >
                        Present
                      </Button>
                      <Button
                        variant={s.attendance === false ? "default" : "outline"}
                        className={`px-4 py-1 text-sm rounded-full ${
                          s.attendance === false
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        onClick={() => toggleAttendance(s.student_id, false)}
                      >
                        Absent
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {students.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              No students loaded. Select semester & date, then click{" "}
              <b>Load Students</b>.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
