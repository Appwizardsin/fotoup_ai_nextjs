import { useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import AuthForm from "./AuthForm";
import { auth } from "@/services/api";

const AuthModal = ({ isOpen, onClose }) => {
  const { signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
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
                await signIn(result.token);
                onClose();
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

      // Request the token
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
      if (isLogin) {
        const result = await auth.login(data);
        if (result.token) {
          await signIn(result.token);
        }
      } else {
        const result = await auth.register(data);
        if (result.token) {
          await signIn(result.token);
        }
      }
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          (isLogin ? "Failed to sign in" : "Failed to create account")
      );
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400">
            {isLogin
              ? "Please sign in to continue"
              : "Sign up to start processing images"}
          </p>
        </div>

        <AuthForm
          mode={isLogin ? "login" : "signup"}
          onSubmit={handleSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          loading={loading}
          error={error}
          onSwitchMode={() => setIsLogin(!isLogin)}
        />
      </div>
    </div>
  );
};

export default AuthModal;
