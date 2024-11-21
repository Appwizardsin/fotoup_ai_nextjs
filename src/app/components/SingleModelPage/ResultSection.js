"use client";

import Image from "next/image";
import { FiDownload } from "react-icons/fi";

const ResultSection = ({
  processedImage,
  error,
  isProcessing,
  model,
  handleDownload,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="block text-sm font-medium text-gray-200">Result</h2>
        {processedImage && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download</span>
          </button>
        )}
      </div>

      {error ? (
        <div className="border-2 border-dashed border-red-700 rounded-lg p-4 bg-red-900/20 h-[40vh]">
          <p className="text-red-400 text-center font-medium mb-2">
            {error.message}
          </p>
          {error.details && (
            <p className="text-red-400/80 text-center text-sm">
              {error.details}
            </p>
          )}
        </div>
      ) : processedImage ? (
        <div className="border-2 border-dashed border-gray-700 rounded-lg h-[60vh] md:h-[70vh] relative">
          <Image
            src={processedImage}
            alt="Processed Result"
            fill
            className="rounded-lg object-contain"
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-700 rounded-lg h-[45vh] md:h-[70vh] relative">
          {isProcessing ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-gray-400">Processing...</p>
              </div>
            </div>
          ) : model.mainImage ? (
            <Image
              src={model.mainImage}
              alt={model.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Processed image will appear here
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultSection;
