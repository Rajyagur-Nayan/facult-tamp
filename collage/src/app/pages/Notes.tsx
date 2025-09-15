"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const GEMINI_API_KEY = "AIzaSyDkjTEDNCS11fSej5JtRNpvaZdBRpS8K8I";

export default function NotesGenerator() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNotes = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic!");

    try {
      setLoading(true);
      setNotes("");
      toast.loading("Generating notes...", { id: "gen" });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
You are a teacher assistant. Generate teacher notes for the topic: "${topic}".  

⚡ Rules:
1. Provide a clear, concise, point-wise response only.
2. Each main point should start with a bullet (•).
3. Include exam-oriented points where relevant.
4. Do NOT add greetings, summaries, explanations, or unrelated text.
5. Use numbered steps only if there are processes or sequences to explain.
6. Keep it simple and easy for teachers to understand.

Return only the notes in the above format. Do NOT use any extra * or markdown symbols.
                  `,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      let generatedNotes =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No notes generated.";

      // Remove all asterisks and extra markdown characters
      generatedNotes = generatedNotes.replace(/\*/g, "").trim();

      // Ensure each line starts with a bullet
      if (!generatedNotes.startsWith("•")) {
        const points = generatedNotes
          .split(/\. |\n/)
          .filter((p: string) => p.trim() !== "")
          .map((p: string) => `• ${p.trim()}`);
        generatedNotes = points.join("\n");
      }

      setNotes(generatedNotes);
      toast.success("Notes generated!", { id: "gen" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error generating notes", { id: "gen" });
      setNotes("Error generating notes.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!notes) return toast.error("No notes to download");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(notes, 180);
    doc.text(lines, 10, 10);
    doc.save(`${topic}_notes.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6 flex justify-center items-start">
      <Card className="w-full max-w-3xl shadow-2xl rounded-2xl bg-white/90">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
          <CardTitle className="text-2xl font-bold text-orange-700">
            Teacher Notes Generator
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-xl border-orange-300 focus:ring-orange-400"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={generateNotes}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
            >
              {loading ? "Generating..." : "Generate Notes"}
            </Button>
            <Button
              onClick={downloadPDF}
              disabled={!notes}
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
            >
              Download PDF
            </Button>
          </div>

          {notes && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-4 overflow-auto max-h-96 whitespace-pre-wrap">
              <h2 className="text-lg font-semibold text-orange-700 mb-2">
                Generated Notes:
              </h2>
              <p>{notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
