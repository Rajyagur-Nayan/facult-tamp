"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface Student {
  student_id: string;
  name: string;
  gender: string;
  semester: number;
  division: string;
}

export default function QuizzesPage() {
  const [topic, setTopic] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [showAccessModal, setShowAccessModal] = useState<boolean>(true);
  const [student, setStudent] = useState<Student>({
    student_id: "",
    name: "",
    gender: "",
    semester: 1,
    division: "A",
  });
  const [marks, setMarks] = useState<number | "">("");

  const token = Cookies.get("access_token");

  /** ===================== FETCH QUIZZES ===================== **/
  const fetchQuizzes = async () => {
    if (!token) return toast.error("You must be logged in to fetch quizzes!");
    if (!topic.trim()) return toast.error("Please enter a topic!");

    try {
      setLoading(true);
      setScore(null);
      setAnswers({});

      // ✅ Updated API route
      const url = `http://127.0.0.1:8000/api/api/quiz/?topic=${encodeURIComponent(
        topic
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // include auth token
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

  /** ===================== HANDLE QUIZ SELECT ===================== **/
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

  /** ===================== HANDLE STUDENT ACCESS REGISTRATION ===================== **/
  const handleStudentChange = (field: keyof Student, value: any) => {
    setStudent((prev) => ({ ...prev, [field]: value }));
  };

  const submitStudentAccess = async () => {
    const { student_id, name, gender, semester, division } = student;
    if (!student_id || !name || !gender || !semester || !division) {
      return toast.error("Please fill all fields to continue!");
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/students/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(student),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Student registration failed:", data);
        toast.error("Failed to register student access!");
        return;
      }

      toast.success("Student registered successfully!");
      setShowAccessModal(false);
    } catch (error) {
      console.error("Error registering student:", error);
      toast.error("Error registering student access");
    }
  };

  /** ===================== SUBMIT MARKS ===================== **/
  const submitMarks = async () => {
    if (marks === "" || marks < 0 || marks > 100) {
      return toast.error("Please enter valid marks (0-100)!");
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/students/${student.student_id}/update-marks/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ marks: Number(marks) }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("Marks update failed:", data);
        toast.error("Failed to update marks!");
        return;
      }

      toast.success("Marks updated successfully!");
      setMarks("");
    } catch (error) {
      console.error("Error updating marks:", error);
      toast.error("Error updating marks");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ===================== ACCESS MODAL ===================== */}
      <Dialog open={showAccessModal}>
        <DialogContent className="rounded-2xl shadow-2xl p-6 bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-purple-700">
              Student Access Registration
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="Enrollment Number"
              value={student.student_id}
              onChange={(e) =>
                handleStudentChange("student_id", e.target.value)
              }
              className="rounded-xl border-purple-300 focus:ring-purple-400"
            />
            <Input
              placeholder="Name"
              value={student.name}
              onChange={(e) => handleStudentChange("name", e.target.value)}
              className="rounded-xl border-purple-300 focus:ring-purple-400"
            />
            <select
              className="border rounded-xl p-2 border-purple-300 focus:ring-purple-400"
              value={student.gender}
              onChange={(e) => handleStudentChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <Input
              type="number"
              placeholder="Semester"
              min={1}
              max={8}
              value={student.semester}
              onChange={(e) =>
                handleStudentChange("semester", Number(e.target.value))
              }
              className="rounded-xl border-purple-300 focus:ring-purple-400"
            />
            <select
              className="border rounded-xl p-2 border-purple-300 focus:ring-purple-400"
              value={student.division}
              onChange={(e) => handleStudentChange("division", e.target.value)}
            >
              <option value="">Select Division</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <DialogFooter>
            <Button className="mt-4 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold transition">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== QUIZZES FORM ===================== */}
      <Card className="mb-8 rounded-3xl shadow-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-700">
            View Quizzes by Topic
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex flex-col w-full md:w-2/3">
            <Input
              placeholder="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl border-purple-300 focus:ring-purple-400 text-purple-800"
            />
          </div>
          <Button
            onClick={fetchQuizzes}
            disabled={loading}
            className="md:self-end rounded-xl px-8 py-3 bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-lg transition-all"
          >
            {loading ? "Loading..." : "Load Quizzes"}
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 shadow-lg border border-purple-200 hover:shadow-2xl transition-all"
            >
              <p className="font-semibold text-lg mb-4 text-blue-500">
                Q{i + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`cursor-pointer rounded-xl p-3 border transition-all flex items-center justify-between
                  ${
                    answers[i] === opt
                      ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                      : "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800"
                  }`}
                  >
                    <span>{opt}</span>
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      checked={answers[i] === opt}
                      onChange={() => handleSelect(i, opt)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </motion.div>
          ))}

          <Button
            onClick={submitQuiz}
            className="w-full py-3 rounded-3xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg transition-all"
          >
            Submit Quiz
          </Button>

          {score !== null && (
            <div className="mt-6 p-6 bg-green-50 rounded-3xl shadow-lg border border-green-200">
              <p className="font-bold text-green-800 text-xl mb-4">
                🎉 You scored {score} / {questions.length}
              </p>

              {/* Marks input */}
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <Input
                  type="number"
                  placeholder="Enter Marks"
                  min={0}
                  max={100}
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="rounded-xl w-full md:w-32 border-green-300 focus:ring-green-400"
                />
                <Button
                  onClick={submitMarks}
                  className="w-full md:w-auto rounded-3xl px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition"
                >
                  Submit Marks
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
