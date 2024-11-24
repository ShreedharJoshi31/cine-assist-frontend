// components/SignupPage.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const router = useRouter();

  const generateIntegerId = () => {
    // Get current timestamp
    const timestamp = Date.now();
    // Get last 6 digits
    const sixDigitNumber = timestamp % 1000000;
    return sixDigitNumber;
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!location) {
      setError("Please select a location");
      setLoading(false);
      return;
    }

    try {
      // First create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      const userId = generateIntegerId();
      console.log(userId, name, email, password, location);

      // Then create user in your backend
      const response = await axios.post("http://127.0.0.1:8000/user/signup", {
        id: userId,
        username: name,
        email: email,
        password: password,
        location: location,
      });
      if (response.data) {
        // Store user data if needed
        localStorage.setItem("user", JSON.stringify(response.data));

        // Redirect to login page or dashboard
        router.push("/home");
      }
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else if (err.response?.data?.detail) {
        // Handle array of errors
        if (Array.isArray(err.response.data.detail)) {
          setError(err.response.data.detail[0].msg || "Validation error");
        } else {
          // Handle string error
          setError(
            typeof err.response.data.detail === "string"
              ? err.response.data.detail
              : "An error occurred during signup"
          );
        }
      } else {
        setError("An error occurred during signup");
      }

      try {
        if (auth.currentUser) {
          await auth.currentUser.delete();
        }
      } catch (deleteErr) {
        console.error("Error cleaning up Firebase user:", deleteErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {location || "Select Location"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[
                    "Andheri",
                    "Dadar",
                    "Vile Parle",
                    "Borivali",
                    "Ghatkopar",
                    "Bandra",
                    "Kurla",
                  ].map((loc) => (
                    <DropdownMenuItem
                      key={loc}
                      onClick={() => setLocation(loc)}
                    >
                      {loc}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            className="w-full"
            type="submit"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <Loader className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="mt-2 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push("/login")}
              disabled={loading}
            >
              Login
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
