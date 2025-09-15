"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "./(auth)/Authcontext";

// ✅ Define nav items for each role
const navItems = {
  admin: [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Notice", href: "/event" },
    { label: "Progress Report", href: "/progress" },
  ],
  student: [
    { label: "Home", href: "/" },
    { label: "Attempt Quiz", href: "/attempt_quiz" },
    { label: "Check Attendance", href: "/s_attendance" },
    { label: "Timetables", href: "/time_table" },
    { label: "Holiday", href: "/s_holiday" },
    { label: "Notes", href: "/s_pdf" },
  ],
  faculty: [
    { label: "Home", href: "/" },
    { label: "Muster", href: "/muster" },
    { label: "Create Quiz", href: "/quiz" },
    { label: "LIve Attendance", href: "/live_attendance" },
    { label: "Timetables", href: "/time_table" },
    { label: "Notice", href: "/s_event" },
    { label: "Holiday", href: "/holidays" },
    { label: "Create Notes", href: "/notes" },
    { label: "Pdf Upload", href: "/uploadPdf" },
  ],
  guest: [
    { label: "Home", href: "/" },
    { label: "Timetables", href: "/time_table" },
    { label: "Holiday", href: "/holidays" },
  ],
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Persist dark mode preference
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  // ✅ Use AuthContext
  const { accessToken, setAccessToken, logout, role, setRole } = useAuth();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SignUp state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("student"); // ✅ default

  // ✅ Login function
  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      toast.success("Login Successfully");

      if (data.user?.role) {
        setRole(data.user.role);
        localStorage.setItem("role", data.user.role);
      }

      const roleKey = data.user?.role || "default";

      if (data.refresh) {
        Cookies.set(`refresh_token_${roleKey}`, data.refresh, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        const refreshResponse = await fetch(
          "http://127.0.0.1:8000/api/auth/token/refresh/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: data.refresh }),
          }
        );

        if (!refreshResponse.ok) throw new Error("Failed to refresh token");

        const refreshData = await refreshResponse.json();

        if (refreshData.access) {
          Cookies.set(`access_token_${roleKey}`, refreshData.access, {
            expires: 1,
            secure: true,
            sameSite: "strict",
          });

          setAccessToken(refreshData.access);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };

  // ✅ Signup function
  const handleSignUp = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
          role: signupRole,
        }),
      });

      if (!response.ok) throw new Error("Signup failed");

      const data = await response.json();
      toast.success("Signup Successfully");

      if (data.user?.role) {
        setRole(data.user.role);
        localStorage.setItem("role", data.user.role);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    }
  };

  const currentNav = !accessToken
    ? navItems.guest
    : navItems[role as keyof typeof navItems] || [];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 px-4 md:px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-blue-700 dark:text-blue-400"
      >
        Faculty & Class Management
      </motion.h1>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex gap-8 text-slate-700 dark:text-slate-200 font-medium items-center">
        {currentNav.map((item, i) => (
          <motion.li
            key={i}
            whileHover={{ scale: 1.1, color: "#1d4ed8" }}
            className="cursor-pointer"
          >
            <a href={item.href}>{item.label}</a>
          </motion.li>
        ))}

        {!accessToken ? (
          <>
            {/* Login */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-4">Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:text-white">
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                  <DialogDescription>
                    Enter your credentials to access the dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="********"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full" onClick={handleLogin}>
                    Sign In
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Signup */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-2">Sign Up</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:text-white">
                <DialogHeader>
                  <DialogTitle>Sign Up</DialogTitle>
                  <DialogDescription>
                    Create a new account to access the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Username</Label>
                    <Input
                      type="text"
                      placeholder="Your username"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="********"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-full border rounded-md p-2 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full" onClick={handleSignUp}>
                    Register
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Button
            variant="outline"
            className="ml-4 text-red-600 border-red-600"
            onClick={() => logout()}
          >
            Logout
          </Button>
        )}

        {/* Dark mode toggle */}
        <Button variant="ghost" className="p-2" onClick={toggleDarkMode}>
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </Button>
      </ul>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2"
        >
          <Menu className="h-6 w-6 text-blue-700 dark:text-blue-400" />
        </Button>

        {/* Dark mode for mobile */}
        <Button variant="ghost" className="p-2" onClick={toggleDarkMode}>
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </Button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col items-start gap-4 px-6 py-4 md:hidden">
          {currentNav.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="w-full text-left text-slate-700 dark:text-slate-200 hover:text-blue-600"
            >
              {item.label}
            </a>
          ))}

          {!accessToken ? (
            <>
              <Button className="w-full" onClick={handleLogin}>
                Login
              </Button>
              <Button className="w-full" onClick={handleSignUp}>
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-600"
              onClick={() => logout()}
            >
              Logout
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
