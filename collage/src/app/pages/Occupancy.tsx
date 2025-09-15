"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const occupancyData = [
  // MON
  { day: "MON", time: "9-10 AM", room: "CR-101", level: 4 },
  { day: "MON", time: "10-11 AM", room: "CR-101", level: 4 },
  { day: "MON", time: "11-12 PM", room: "LAB-03", level: 2 },
  { day: "MON", time: "1-2 PM", room: "LAB-03", level: 2 },
  { day: "MON", time: "2-3 PM", room: "Free", level: 0 },
  { day: "MON", time: "3-4 PM", room: "CR-204", level: 5 },
  // TUE
  { day: "TUE", time: "9-10 AM", room: "Free", level: 0 },
  { day: "TUE", time: "10-11 AM", room: "CR-301", level: 5 },
  { day: "TUE", time: "11-12 PM", room: "CR-102", level: 4 },
  { day: "TUE", time: "1-2 PM", room: "LAB-01", level: 2 },
  { day: "TUE", time: "2-3 PM", room: "LAB-01", level: 2 },
  { day: "TUE", time: "3-4 PM", room: "Free", level: 0 },
];

const timeSlots = [
  "9-10 AM",
  "10-11 AM",
  "11-12 PM",
  "1-2 PM",
  "2-3 PM",
  "3-4 PM",
];
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
const occupancyLevels: { [key: number]: string } = {
  0: "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  1: "bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200",
  2: "bg-emerald-200 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-100",
  3: "bg-emerald-300 dark:bg-emerald-600 text-emerald-900 dark:text-white",
  4: "bg-emerald-400 dark:bg-emerald-500 text-white",
  5: "bg-emerald-500 dark:bg-emerald-400 text-white dark:text-emerald-900",
  6: "bg-emerald-600 dark:bg-emerald-300 text-white dark:text-emerald-900",
};

export default function Occupancy() {
  return (
    <Card className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-900">
      <CardHeader className="bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 text-white text-center">
        <CardTitle className="text-xl md:text-2xl font-bold drop-shadow-sm">
          📊 Classroom & Lab Occupancy Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 overflow-x-auto">
        <div className="inline-grid min-w-[600px] grid-cols-[auto_repeat(6,1fr)] text-center text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="p-3 bg-gray-100 dark:bg-gray-800 border-r border-b dark:border-gray-700">
            Time
          </div>
          {timeSlots.map((t) => (
            <div
              key={t}
              className="p-3 bg-gray-100 dark:bg-gray-800 border-r border-b dark:border-gray-700"
            >
              {t}
            </div>
          ))}

          {/* Days + cells */}
          {days.map((day) => (
            <div key={day} className="contents">
              <div className="p-3 font-bold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-r border-b dark:border-gray-700">
                {day}
              </div>
              {timeSlots.map((time) => {
                const cell = occupancyData.find(
                  (d) => d.day === day && d.time === time
                ) || { room: "Free", level: 0 };
                return (
                  <div
                    key={`${day}-${time}`}
                    className="p-1 border-r border-b dark:border-gray-700"
                  >
                    <div
                      className={`w-full h-14 sm:h-16 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold shadow-sm transition-transform duration-200 hover:scale-105 ${
                        occupancyLevels[cell.level]
                      }`}
                    >
                      {cell.room}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center italic">
          💡 Hover over slots to feel the interaction
        </p>
      </CardContent>
    </Card>
  );
}
