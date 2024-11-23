'use client';

import { FaCoins } from 'react-icons/fa';

const ProcessButton = ({ 
  isProcessing, 
  allRequiredFieldsFilled, 
  user, 
  model, 
  handleProcessImage, 
  className 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {user && user.credits < (model.creditCost || 0) && (
        <div className="text-red-400 text-sm flex items-center gap-2">
          <FaCoins className="text-yellow-400 w-4 h-4" />
          <span>
            Insufficient credits. You need {model.creditCost - user.credits} more credits.
          </span>
        </div>
      )}
      <button
        onClick={handleProcessImage}
        disabled={
          isProcessing ||
          !allRequiredFieldsFilled ||
          (user && user.credits < (model.creditCost || 0))
        }
        className={`w-full py-2 px-4 md:rounded-lg text-white ${
          isProcessing ||
          !allRequiredFieldsFilled ||
          (user && user.credits < (model.creditCost || 0))
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              <span>Process Image</span>
              <div className="flex items-center gap-1 text-sm bg-black/20 px-2 py-0.5 rounded">
                <FaCoins className="text-yellow-400 w-3 h-3" />
                <span>{model.creditCost || 0}</span>
              </div>
            </>
          )}
        </div>
      </button>
      {!user && (
        <p className="text-sm text-gray-400 text-center">
          Sign in to process images
        </p>
      )}
    </div>
  );
};

export default ProcessButton; 