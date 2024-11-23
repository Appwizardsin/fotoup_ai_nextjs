"use client";

export default function ErrorButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    >
      Try Again
    </button>
  );
} 