"use client";

import Image from "next/image";
import { FiDownload } from "react-icons/fi";

const ResultSection = ({
  processedImage,
  error,
  isProcessing,
  model,
  handleDownload,
  progress,
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
                {/* Loading bar */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 uppercase">
                        Processing...
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 uppercase">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
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
