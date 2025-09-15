"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Users,
  BookOpen,
  FlaskConical,
  ClipboardCheck,
  Calendar,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const workloadChartData = {
  labels: ["Underload (<14hr)", "Normal (14-20hr)", "Overload (>20hr)"],
  datasets: [
    {
      label: "Number of Faculty",
      data: [18, 85, 25],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)", // Blue
        "rgba(34, 197, 94, 0.7)", // Green
        "rgba(239, 68, 68, 0.7)", // Red
      ],
      borderColor: [
        "rgba(59, 130, 246, 1)",
        "rgba(34, 197, 94, 1)",
        "rgba(239, 68, 68, 1)",
      ],
      borderWidth: 1.5,
      borderRadius: 6,
    },
  ],
};

const workloadChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } },
  plugins: { legend: { display: false } },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 space-y-8 transition-colors">
      {/* Top Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Faculty", value: "128", icon: Users, color: "blue" },
          {
            title: "Active Classes",
            value: "452",
            icon: BookOpen,
            color: "green",
          },
          {
            title: "Lab Occupancy",
            value: "78%",
            icon: FlaskConical,
            color: "purple",
          },
          {
            title: "Muster Generated",
            value: "1,820",
            icon: ClipboardCheck,
            color: "pink",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="rounded-2xl shadow-lg bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-transform hover:scale-[1.02]"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold text-${stat.color}-700 dark:text-${stat.color}-300`}
              >
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workload Chart */}
        <Card className="lg:col-span-2 rounded-2xl shadow-lg bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="font-semibold text-gray-800 dark:text-gray-200">
              📊 Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[380px]">
            <Bar options={workloadChartOptions} data={workloadChartData} />
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card className="rounded-2xl shadow-lg bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Upcoming Holidays
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[380px]">
            <ul className="space-y-5">
              {[
                {
                  month: "OCT",
                  day: "02",
                  name: "Gandhi Jayanti",
                  type: "National Holiday",
                  color: "red",
                },
                {
                  month: "OCT",
                  day: "24",
                  name: "Dussehra",
                  type: "Restricted Holiday",
                  color: "yellow",
                },
                {
                  month: "NOV",
                  day: "14",
                  name: "Diwali",
                  type: "Festival Holiday",
                  color: "purple",
                },
              ].map((holiday, i) => (
                <li
                  key={i}
                  className="flex items-center p-3 rounded-xl bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:scale-[1.01] transition-transform"
                >
                  <div
                    className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg shadow-md bg-${holiday.color}-100 text-${holiday.color}-700 dark:bg-${holiday.color}-900 dark:text-${holiday.color}-300`}
                  >
                    <span className="text-xs font-bold">{holiday.month}</span>
                    <span className="text-xl font-extrabold">
                      {holiday.day}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {holiday.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {holiday.type}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
