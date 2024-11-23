"use client";

import Image from "next/image";
import { FiDownload, FiMaximize2 } from "react-icons/fi";
import { BiUpArrowAlt } from "react-icons/bi";
import { MdOutlineAutoFixHigh } from "react-icons/md";
import { RxScissors } from "react-icons/rx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ENHANCEMENT_BUTTONS = [
  {
    id: "upscale",
    label: "Upscale",
    modelId: "673de2326492be4ae09f93db",
    icon: BiUpArrowAlt,
  },
  {
    id: "remove-bg",
    label: "Remove BG",
    modelId: "673de2f06492be4ae09f93df",
    icon: RxScissors,
  },
  {
    id: "beautify",
    label: "Beautify",
    modelId: "673de4176492be4ae09f93e5",
    icon: MdOutlineAutoFixHigh,
  },
  {
    id: "expand",
    label: "Expand",
    modelId: "673de4176492be4ae09f93e5",
    icon: FiMaximize2,
  },
];

const ResultSection = ({
  processedImage,
  error,
  isProcessing,
  model,
  handleDownload,
  progress,
}) => {
  const searchParams = useSearchParams();
  const presetImageUrl = searchParams.get("imageUrl");

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
        <div>
          <div className="border-2 border-dashed border-gray-700 rounded-lg h-[40vh] md:h-[60vh] relative">
            <Image
              src={processedImage}
              alt="Processed Result"
              fill
              className="rounded-lg object-contain"
            />
          </div>

          <div className="mt-4 flex justify-center gap-4">
            {ENHANCEMENT_BUTTONS.map((button) => {
              const Icon = button.icon;
              return (
                <Link
                  key={button.id}
                  href={`/model/${button.modelId}?imageUrl=${encodeURIComponent(
                    processedImage
                  )}`}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors mb-1">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-300">{button.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-700 rounded-lg h-[40vh] md:h-[70vh] relative">
          {isProcessing ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {progress === 100 ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-semibold">Finalizing...</span>
                  </div>
                ) : (
                  /* Loading bar */
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
                )}
              </div>
            </div>
          ) : presetImageUrl ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Your processed image will appear here
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
