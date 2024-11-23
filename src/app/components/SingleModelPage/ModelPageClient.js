"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { models } from "@/services/api";
import { useAuth } from "@/app/context/AuthContext";
import ExampleSection from "./ExampleSection";
import InputField from "./InputField";
import ResultSection from "./ResultSection";
import ProcessButton from "./ProcessButton";
import AuthModal from "../AuthModal";

export default function ModelPageClient({ initialModel }) {
  const router = useRouter();
  const { user } = useAuth();
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState(null);
  const [inputs, setInputs] = useState({});
  const [processingImageProgress, setProcessingImageProgress] = useState(0);
  const searchParams = useSearchParams();

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Handle preset image URL
  useEffect(() => {
    const imageUrl = searchParams.get("imageUrl");
    if (imageUrl && initialModel) {
      const imageField = initialModel.requiredInputs.find(
        (field) => field.type === "image"
      );
      if (imageField) {
        handleInputChange(imageField.key, imageUrl);
      }
    }
  }, [searchParams, initialModel]);

  const handleProcessImage = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setProcessedImage(null);
    setError(null);

    const missingInputs = initialModel.requiredInputs
      .filter((field) => field.required && !inputs[field.key])
      .map((field) => field.displayName);

    if (missingInputs.length > 0) {
      setError(`Please provide: ${missingInputs.join(", ")}`);
      return;
    }

    setIsProcessing(true);
    try {
      const requestData = {
        modelId: initialModel._id,
        ...inputs,
      };

      const interval = setInterval(() => {
        setProcessingImageProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev >= 90 ? prev + 2 : prev + 10;
        });
      }, 1200);

      const data = await models.run(requestData);

      if (data.imageUrl) {
        setProcessedImage(data.imageUrl);
      } else if (data instanceof Blob) {
        const imageUrl = URL.createObjectURL(data);
        setProcessedImage(imageUrl);
      }
      clearInterval(interval);
    } catch (error) {
      console.error("Error processing image:", error);
      setError({
        message: error.response?.data?.message || "Error processing image",
        details: error.response?.data?.error || error.message,
      });
      setProcessingImageProgress(0);
    } finally {
      setIsProcessing(false);
      setProcessingImageProgress(0);
    }
  };

  const handleDownload = async () => {
    if (processedImage) {
      const image = await fetch(processedImage);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Check if all required fields are filled
  const allRequiredFieldsFilled = initialModel.requiredInputs.every(
    (field) => !field.required || inputs[field.key]
  );

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 relative">
      {/* Mobile Process Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-800 z-50">
        <div className="container mx-auto">
          <ProcessButton
            isProcessing={isProcessing}
            allRequiredFieldsFilled={allRequiredFieldsFilled}
            user={user}
            model={initialModel}
            handleProcessImage={handleProcessImage}
          />
        </div>
      </div>

      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-white">
            {initialModel.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:flex md:flex-row-reverse">
        <div className="md:w-1/2">
          <ResultSection
            processedImage={processedImage}
            error={error}
            isProcessing={isProcessing}
            model={initialModel}
            handleDownload={handleDownload}
            progress={processingImageProgress}
          />
        </div>

        <div className="md:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 gap-4 mb-8">
            {initialModel.requiredInputs.map((field) => (
              <div
                key={field.key}
                className={`${
                  field.type === "image"
                    ? "col-span-1 sm:col-span-1"
                    : "col-span-2 sm:col-span-2"
                } md:col-span-1`}
              >
                <InputField
                  field={field}
                  value={inputs[field.key]}
                  onChange={(value) => handleInputChange(field.key, value)}
                />
              </div>
            ))}
          </div>

          <ProcessButton
            className="hidden md:block mt-8"
            isProcessing={isProcessing}
            allRequiredFieldsFilled={allRequiredFieldsFilled}
            user={user}
            model={initialModel}
            handleProcessImage={handleProcessImage}
          />
        </div>
      </div>

      <div className="mt-2 md:mt-8">
        <ExampleSection model={initialModel} />
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
