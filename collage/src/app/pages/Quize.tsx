"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Loader2, Sparkles } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizPage() {
  const [topic, setTopic] = useState("Stacks");
  const [level, setLevel] = useState("medium");
  const [semester, setSemester] = useState("1");
  const [, setQuiz] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setCurrentTopic] = useState<string>("");
  const [marks, setMarks] = useState<number | "">("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const token = Cookies.get("access_token");

  // POST request → generate quiz
  const generateQuiz = async () => {
    try {
      setLoading(true);
      setScore(null);

      const res = await fetch("http://127.0.0.1:8000/api/generate-quiz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, level, semester }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to generate quiz");

      toast.success("Quiz generated! Click 'Show Quiz' to view.");
      setCurrentTopic(topic);
      setQuiz([]);
    } catch (err) {
      toast.error("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  // GET request → fetch quiz
  const fetchQuizzes = async () => {
    if (!token) return toast.error("You must be logged in to fetch quizzes!");
    if (!topic.trim()) return toast.error("Please enter a topic!");

    try {
      setLoading(true);
      setScore(null);
      setAnswers({});

      const url = `http://127.0.0.1:8000/api/api/quiz/?topic=${encodeURIComponent(
        topic
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Failed to fetch quizzes");
        return;
      }

      const data = await response.json();
      console.log(data);

      if (data.status !== "success" || !Array.isArray(data.quizzes)) {
        toast.error("Invalid data received from API");
        setQuestions([]);
        return;
      }

      const quizData: Question[] = data.quizzes.map((q: any) => ({
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
        answer: q.answer,
      }));

      setQuestions(quizData);
      toast.success(`Loaded ${data.count} quizzes for topic "${topic}"`);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const submitQuiz = () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions before submitting!");
      return;
    }

    let total = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) total++;
    });
    setScore(total);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors p-6">
      {/* HEADER */}
      <Card className="max-w-3xl mx-auto shadow-xl rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-800">
        <CardHeader className="text-center py-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-t-3xl">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
            🎯 Interactive Quiz Portal
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">
            Select topic, difficulty, and semester to generate your quiz
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Quiz Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter Topic"
              className="rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <Select onValueChange={setLevel} defaultValue={level}>
              <SelectTrigger className="rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="Semester"
              className="rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={generateQuiz}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md rounded-xl transition-transform transform hover:scale-105"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                "Generate Quiz"
              )}
            </Button>
            <Button
              onClick={fetchQuizzes}
              disabled={loading || !topic}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md rounded-xl transition-transform transform hover:scale-105"
            >
              Show Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QUIZ CONTENT */}
      {questions.length > 0 && (
        <Card className="max-w-4xl mx-auto mt-8 shadow-xl rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/20 dark:border-gray-800">
          <CardHeader className="bg-gradient-to-r from-purple-200/50 to-pink-200/50 dark:from-purple-900/30 dark:to-pink-900/30 py-4 rounded-t-3xl">
            <CardTitle className="text-xl font-bold text-purple-700 dark:text-purple-300 text-center">
              Quizzes for &quot;{topic}&quot;
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {questions.map((q, i) => (
              <div
                key={i}
                className="p-5 border border-purple-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/60 shadow-md hover:shadow-lg transition"
              >
                <p className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Q{i + 1}. {q.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() => handleSelect(i, opt)}
                      className={`px-4 py-2 rounded-xl border text-left transition-colors ${
                        answers[i] === opt
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent"
                          : "bg-purple-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-purple-200 dark:border-gray-600 hover:bg-purple-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <Button
              onClick={submitQuiz}
              className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-md rounded-xl transition-transform transform hover:scale-105"
            >
              Submit Quiz
            </Button>

            {score !== null && (
              <div className="mt-8 p-6 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-800/40 rounded-2xl shadow-inner text-center">
                <p className="font-bold text-lg text-green-800 dark:text-green-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  You scored {score} / {questions.length}
                </p>
                <div className="mt-5 flex flex-col md:flex-row justify-center items-center gap-4">
                  <Input
                    type="number"
                    placeholder="Enter Marks"
                    min={0}
                    max={100}
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md rounded-xl">
                    Submit Marks
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
