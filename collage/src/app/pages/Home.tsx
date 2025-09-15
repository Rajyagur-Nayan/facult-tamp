"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Calendar,
  BarChart3,
  ClipboardList,
  Users,
  FileSpreadsheet,
  LineChart,
  Building2,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: <GraduationCap className="w-10 h-10 text-white" />,
    title: "Faculty Master",
    desc: "Auto-generate workload details and assignments from class data.",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: <Calendar className="w-10 h-10 text-white" />,
    title: "Timetables",
    desc: "Clash-free weekly structure for faculty, classes, and labs.",
    color: "from-indigo-500 to-indigo-700",
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-white" />,
    title: "Analytics",
    desc: "Workload, occupancy, and department-level insights.",
    color: "from-teal-500 to-teal-700",
  },
  {
    icon: <ClipboardList className="w-10 h-10 text-white" />,
    title: "Muster Sheets",
    desc: "Attendance registers with holiday exclusions, exportable to PDF/Excel.",
    color: "from-pink-500 to-pink-700",
  },
];

const steps = [
  {
    icon: <CheckCircle className="w-12 h-12 text-white mx-auto" />,
    title: "Step 1: Add Data",
    desc: "Enter faculty, student, and class information into the system.",
    bg: "bg-purple-500",
  },
  {
    icon: <Calendar className="w-12 h-12 text-white mx-auto" />,
    title: "Step 2: Generate Timetable",
    desc: "Automatically create clash-free schedules for classes and labs.",
    bg: "bg-indigo-500",
  },
  {
    icon: <BarChart3 className="w-12 h-12 text-white mx-auto" />,
    title: "Step 3: Analyze & Export",
    desc: "View occupancy and workload reports, export muster sheets easily.",
    bg: "bg-teal-500",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with shapes */}
      <section className="relative text-center py-24 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-indigo-300 rounded-full opacity-30 animate-pulse"></div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white z-10 relative"
        >
          Simplify Faculty & Class Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-slate-700 dark:text-slate-300 z-10 relative"
        >
          Generate timetables, track workloads, monitor occupancy, and create
          muster sheets automatically with holiday exclusions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 flex justify-center gap-6 z-10 relative"
        >
          <Button
            size="lg"
            className="px-10 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:scale-105 transform transition-transform"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-10 py-3 rounded-full text-purple-700 border-purple-700 hover:bg-purple-50 shadow-md"
          >
            Learn More
          </Button>
        </motion.div>
      </section>

      {/* Features Section with gradient cards */}
      <section className="mt-24 px-6 md:px-16 grid md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-3xl p-6 shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all bg-gradient-to-br ${f.color}`}
          >
            <div className="flex justify-center mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold text-white">{f.title}</h3>
            <p className="mt-2 text-white/90">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* How it Works - Vertical timeline */}
      <section className="mt-24 px-6 md:px-16 relative">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">
          How It Works
        </h2>
        <div className="relative border-l-2 border-gray-300 dark:border-gray-600 ml-8 md:ml-24">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="mb-12 relative pl-12"
            >
              <div
                className={`absolute -left-8 w-16 h-16 ${step.bg} text-white rounded-full flex items-center justify-center shadow-lg`}
              >
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials with enhanced style */}
      <section className="mt-24 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Dr. Priya Sharma",
              feedback:
                "This platform saved us hours of manual scheduling. Highly recommended!",
            },
            {
              name: "Prof. Rakesh Kumar",
              feedback:
                "The occupancy heatmaps and workload analytics are game-changers for our department.",
            },
            {
              name: "Ms. Anjali Mehta",
              feedback:
                "Exporting muster sheets to PDF is so convenient. It’s a must-have tool.",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-lg p-8 transform transition-transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Quotation mark */}
              <span className="absolute -top-5 left-6 text-4xl text-purple-400 dark:text-purple-300">
                &ldquo;
              </span>

              <p className="text-slate-700 dark:text-slate-300 italic text-lg mt-2">
                {t.feedback}
              </p>
              <h4 className="mt-6 font-semibold text-slate-900 dark:text-white text-right">
                — {t.name}
              </h4>

              {/* Speech bubble triangle */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-t-8 border-t-purple-100 dark:border-t-gray-700 border-x-8 border-x-transparent"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="mt-24 px-6 md:px-16 text-center py-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl shadow-lg mx-6 md:mx-16 mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get In Touch
        </h2>
        <p className="text-white/90 mb-8">
          Have questions or want a demo? Reach out to our team.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Button className="px-10 py-3 rounded-full bg-white text-purple-600 hover:scale-105 transform transition-transform shadow-lg">
            Request a Demo
          </Button>
          <Button
            variant="outline"
            className="px-10 py-3 rounded-full text-white border-white hover:bg-white/10 shadow-md"
          >
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}
