'use client';

export default function ProcessingModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Processing Your Payment
        </h2>
        <p className="text-gray-400">
          Please wait while we activate your subscription...
        </p>
      </div>
    </div>
  );
} 