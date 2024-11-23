"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "../components/AuthForm";
import { auth } from "@/services/api";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setError("");

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "email profile",
        callback: async (response) => {
          if (response.access_token) {
            try {
              setLoading(true);
              const result = await auth.googleLogin(response.access_token);
              if (result.token) {
                await signIn(result.token);
                router.push("/");
              }
            } catch (error) {
              setError(
                error.response?.data?.message || "Failed to sign up with Google"
              );
              console.error("Error signing up with Google:", error);
            }
            setLoading(false);
          }
        },
      });

      client.requestAccessToken();
    } catch (error) {
      setError("Failed to initialize Google Sign In");
      console.error("Error initializing Google Sign In:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setError("");
      setLoading(true);
      const result = await auth.register(data);
      if (result.token) {
        localStorage.setItem("token", result.token);
        router.push("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create an account");
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>

        <AuthForm
          mode="signup"
          onSubmit={handleSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          loading={loading}
          error={error}
        />

        <div className="text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
