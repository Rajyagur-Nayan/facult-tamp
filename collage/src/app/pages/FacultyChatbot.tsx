"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const GEMINI_API_KEY = "AIzaSyDkjTEDNCS11fSej5JtRNpvaZdBRpS8K8I";

const predefinedQuestions = [
  "How do I generate a faculty timetable?",
  "How can I view class occupancy?",
  "How do I create muster sheets?",
  "How to calculate faculty workload?",
  "How to export reports in PDF/Excel?",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  const sendMessage = async (customInput?: string) => {
    const text = customInput || input;
    if (!text.trim()) return;

    const userMessage = { role: "user" as const, text };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=" +
          GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
You are an expert assistant for a web app called 
"Automated Faculty & Class Management System with Muster Generation".

⚡ Response Rules:
1. Only answer questions related to: colleges, faculty management, class management, attendance tracking, muster generation, or features of this system.
2. Always respond in a **clean structured format**:
   - Start with a short **one-line summary** in bold.
   - Then provide a clear **point-wise answer** (using bullet points).
   - If steps are involved, use **numbered steps**.
   - Keep it simple and professional.
3. If the user asks anything unrelated, reply:
   **"🚫 I can only help with questions related to the Automated Faculty & Class Management System with Muster Generation."**

Now, here is the user’s question:
${text}
`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      let botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      // Convert long text into points if not already
      if (!botReply.startsWith("-")) {
        const points = botReply
          .split(/\. |\n/)
          .filter((p: string) => p.trim() !== "")
          .map((p: string) => `• ${p.trim()}`);
        botReply = points.join("\n");
      }
      // Hide typing indicator
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error fetching response." },
      ]);
      console.log(error);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-transform transform hover:scale-110"
      >
        <MessageCircle className="h-8 w-8 md:h-10 md:w-10" />
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 font-bold text-lg flex justify-between items-center rounded-t-3xl shadow-md">
              Faculty Assistant
              <Button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 shadow-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Predefined Questions */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-200">
              {predefinedQuestions.map((q, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline"
                  onClick={() => sendMessage(q)}
                  className="text-gray-700 hover:bg-blue-50 border-gray-300"
                >
                  {q}
                </Button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm max-h-96 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-xl max-w-[80%] whitespace-pre-line break-words shadow-sm ${
                    m.role === "user"
                      ? "bg-blue-100 self-end ml-auto text-gray-900"
                      : "bg-gray-100 self-start mr-auto text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="bg-gray-100 text-gray-500 p-2 rounded-xl max-w-[60%] self-start mr-auto italic animate-pulse">
                  Bot is typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center border-t border-gray-200 p-3 bg-gray-50 rounded-b-3xl gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Ask me anything..."
              />
              <Button
                onClick={() => sendMessage()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform transform hover:scale-110"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
