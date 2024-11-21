"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "../components/AuthForm";
import { auth } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError("");

      // Load the Google API client
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "email profile",
        callback: async (response) => {
          if (response.access_token) {
            try {
              const result = await auth.googleLogin(response.access_token);
              if (result.token) {
                localStorage.setItem("token", result.token);
                router.push("/");
              }
            } catch (error) {
              setError(
                error.response?.data?.message || "Failed to sign in with Google"
              );
              console.error("Error signing in with Google:", error);
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
      const result = await auth.login(data);
      if (result.token) {
        localStorage.setItem("token", result.token);
        router.push("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to sign in");
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>

        <AuthForm
          mode="login"
          onSubmit={handleSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          loading={loading}
          error={error}
        />

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:text-blue-400"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
