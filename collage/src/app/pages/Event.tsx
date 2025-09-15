"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });

  const token = Cookies.get("access_token");

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-events/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/add-event/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error("Failed to add event");
      await fetchEvents();
      setNewEvent({ title: "", description: "", date: "", time: "" });
      toast.success("Event added successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Error adding event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 md:p-12">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm"
      >
        Faculty Events & Notices
      </motion.h1>

      {/* Add Event Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="mb-16 p-8 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/30 max-w-2xl mx-auto space-y-5"
      >
        <input
          type="text"
          name="title"
          value={newEvent.title}
          onChange={handleChange}
          placeholder="Enter event title"
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white bg-white/80 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          required
        />
        <textarea
          name="description"
          value={newEvent.description}
          onChange={handleChange}
          placeholder="Enter event description"
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white bg-white/80 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white bg-white/80 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <input
            type="time"
            name="time"
            value={newEvent.time}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white bg-white/80 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:opacity-95"
        >
          ➕ Add Event
        </button>
      </motion.form>

      {/* Events List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          Upcoming Events
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event: any, i: number) => {
            const gradients = [
              "from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40",
              "from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40",
              "from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40",
              "from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40",
              "from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40",
              "from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40",
            ];
            const gradient = gradients[i % gradients.length];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${gradient} p-1`}
                >
                  <div className="rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md h-full p-6 flex flex-col">
                    <CardHeader className="p-0 mb-3">
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        📅 {event.date} • 🕒 {event.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
