"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function Muster() {
  const [students, setStudents] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("access_token");

  const fetchStudents = async () => {
    if (!token) return toast.error("Auth token not found!");
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/students/all/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      console.log("Fetch Students Response:", data);

      if (Array.isArray(data)) setStudents(data);
      else if (Array.isArray(data.students)) setStudents(data.students);
      else setStudents([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); // Automatically fetch students on component mount
  }, []);

  const uploadFile = async () => {
    if (!file) return toast.error("Select a file first!");
    if (!token) return toast.error("Auth token not found!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      toast.loading("Uploading file...", { id: "upload" });

      const response = await fetch("http://127.0.0.1:8000/api/students/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Upload Response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "File upload failed");
      }

      toast.success("File uploaded successfully!", { id: "upload" });
      setFile(null);
      fetchStudents();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error uploading file", { id: "upload" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <Card className="bg-white/90 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl font-bold text-purple-700">
              Muster (Attendance Register)
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="rounded-xl border-purple-300 focus:ring-purple-400"
              />
              <Button
                onClick={uploadFile}
                disabled={loading || !file}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? "Uploading..." : "Upload Excel"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No students to display. Upload a file to add students.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="rounded-lg border border-purple-200">
                <TableHeader>
                  <TableRow className="bg-purple-100">
                    {Object.keys(students[0]).map((key) => (
                      <TableHead key={key} className="text-purple-700">
                        {key.replace("_", " ").toUpperCase()}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-purple-50 transition"
                    >
                      {Object.values(s).map((val: any, i) => (
                        <TableCell key={i}>{val}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
