"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const AuthForm = ({
  mode = "login",
  onSubmit,
  onGoogleSignIn,
  loading,
  error,
  onSwitchMode,
  className = "",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { checkAuth } = useAuth();
  const router = useRouter();

  const isLogin = mode === "login";
  const isSignUp = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = isLogin ? { email, password } : { name, email, password };
    await onSubmit(data);
    checkAuth();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {error && <div className="text-center text-red-500 text-sm">{error}</div>}

      <button
        onClick={onGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
      >
        <FcGoogle className="text-xl" />
        <span>Continue with Google</span>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2  text-gray-400">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? isLogin
              ? "Signing in..."
              : "Creating account..."
            : isLogin
            ? "Sign In"
            : "Sign Up"}
        </button>
      </form>

      {onSwitchMode && (
        <div className="text-center text-gray-400">
          {isLogin ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                onClick={onSwitchMode}
                className="text-blue-500 hover:text-blue-400"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={onSwitchMode}
                className="text-blue-500 hover:text-blue-400"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthForm;
