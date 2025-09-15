"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "./(auth)/Authcontext";

interface Event {
  id: number;
  title: string;
  description: string;
  event_datetime: string;
}

export default function ShowEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/get-events/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch events");

        const data: Event[] = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchEvents();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-lg font-medium text-gray-600">
        Loading events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        No events available.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-amber-200 mb-12">
        📌 Upcoming Events
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => {
          const eventDate = new Date(event.event_datetime);
          const day = eventDate.getDate();
          const month = eventDate.toLocaleString("default", { month: "short" });
          const formattedTime = eventDate.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative bg-gradient-to-tr from-purple-50 to-purple-100 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden border border-purple-200">
                {/* Date Badge */}
                <div className="absolute -top-2 left-4 bg-purple-600 text-white w-13 h-13 flex flex-col justify-center items-center rounded-lg shadow-md z-10">
                  <span className="text-sm font-bold">{day}</span>
                  <span className="text-xs">{month}</span>
                </div>

                <div className="p-6 pt-10 flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h2>
                  <p className="text-gray-700 mb-4 break-words">
                    {event.description}
                  </p>
                  <div className="flex items-center text-gray-600 text-sm gap-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {eventDate.toDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formattedTime}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
