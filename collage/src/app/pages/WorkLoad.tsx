import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

const workloadData = [
  {
    name: "Dr. Vikram Rao",
    dept: "Computer Science",
    lec: 12,
    lab: 6,
    total: 18,
    status: "Normal",
  },
  {
    name: "Dr. Priya Singh",
    dept: "Computer Science",
    lec: 16,
    lab: 6,
    total: 22,
    status: "Overload",
  },
  {
    name: "Prof. Arjun Mehta",
    dept: "Computer Science",
    lec: 8,
    lab: 4,
    total: 12,
    status: "Underload",
  },
  {
    name: "Dr. Sneha Reddy",
    dept: "Electronics",
    lec: 14,
    lab: 4,
    total: 18,
    status: "Normal",
  },
  {
    name: "Prof. Rohan Desai",
    dept: "Mechanical",
    lec: 10,
    lab: 8,
    total: 18,
    status: "Normal",
  },
];

const statusStyles: { [key: string]: string } = {
  Normal:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200",
  Overload: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200",
  Underload:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200",
};

export default function WorkLoad() {
  return (
    <Card className="shadow-2xl rounded-2xl border-none bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <CardTitle className="text-3xl font-extrabold text-gray-800 dark:text-white drop-shadow-md">
          Faculty Workload Summary
        </CardTitle>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-2xl shadow-lg backdrop-blur-sm bg-white/70 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
          <Table className="min-w-full border-collapse text-gray-700 dark:text-gray-200">
            <TableHeader className="bg-gray-100 dark:bg-gray-800 rounded-t-2xl">
              <TableRow>
                <TableHead className="px-6 py-3 text-left">
                  Faculty Name
                </TableHead>
                <TableHead className="px-6 py-3">Department</TableHead>
                <TableHead className="px-6 py-3">Lecture Hours</TableHead>
                <TableHead className="px-6 py-3">Lab Hours</TableHead>
                <TableHead className="px-6 py-3">Total Hours</TableHead>
                <TableHead className="px-6 py-3">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {workloadData.map((faculty, idx) => (
                <TableRow
                  key={faculty.name}
                  className={`transition-transform transform hover:scale-[1.01] hover:shadow-lg rounded-lg ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <TableCell className="font-semibold px-6 py-4">
                    {faculty.name}
                  </TableCell>
                  <TableCell className="px-6 py-4">{faculty.dept}</TableCell>
                  <TableCell className="px-6 py-4">{faculty.lec}</TableCell>
                  <TableCell className="px-6 py-4">{faculty.lab}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className={`h-4 rounded-full ${
                          faculty.total >= 20
                            ? "bg-red-500"
                            : faculty.total >= 15
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                        style={{ width: `${(faculty.total / 24) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold ml-2">
                      {faculty.total} hrs
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[faculty.status]
                      }`}
                    >
                      {faculty.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
