"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { models } from "@/services/api";
import { useAuth } from "@/app/context/AuthContext";
import ExampleSection from "@/app/components/SingleModelPage/ExampleSection";
import InputField from "@/app/components/SingleModelPage/InputField";
import ResultSection from "@/app/components/SingleModelPage/ResultSection";
import ProcessButton from "@/app/components/SingleModelPage/ProcessButton";
import AuthModal from "@/app/components/AuthModal";

export default function SingleModelPage() {
  const { modelId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState(null);
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await models.getSingle(modelId);
        setModel(response);
      } catch (err) {
        console.error("Error fetching model:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [modelId]);

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleProcessImage = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setProcessedImage(null);
    setError(null);

    const missingInputs = model.requiredInputs
      .filter((field) => field.required && !inputs[field.key])
      .map((field) => field.displayName);

    if (missingInputs.length > 0) {
      setError(`Please provide: ${missingInputs.join(", ")}`);
      return;
    }

    setIsProcessing(true);

    try {
      const requestData = {
        modelId,
        ...inputs,
      };

      const data = await models.run(requestData);

      if (data.imageUrl) {
        setProcessedImage(data.imageUrl);
      } else if (data instanceof Blob) {
        const imageUrl = URL.createObjectURL(data);
        setProcessedImage(imageUrl);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError({
        message: error.response?.data?.message || "Error processing image",
        details: error.response?.data?.error || error.message,
      });
    } finally {
      setIsProcessing(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading model...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Model not found
          </h2>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if all required fields are filled
  const allRequiredFieldsFilled = model.requiredInputs.every(
    (field) => !field.required || inputs[field.key]
  );

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 relative">
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 border-t border-gray-800 z-50">
        <div className="container mx-auto">
          <ProcessButton
            isProcessing={isProcessing}
            allRequiredFieldsFilled={allRequiredFieldsFilled}
            user={user}
            model={model}
            handleProcessImage={handleProcessImage}
          />
        </div>
      </div>

      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-white">
            {model.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:flex md:flex-row-reverse">
        <div className="md:w-1/2">
          <ResultSection
            processedImage={processedImage}
            error={error}
            isProcessing={isProcessing}
            model={model}
            handleDownload={handleDownload}
          />
        </div>

        <div className="md:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 gap-4 mb-8">
            {model.requiredInputs.map((field) => (
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
            model={model}
            handleProcessImage={handleProcessImage}
          />
        </div>
      </div>

      <div className="mt-2 md:mt-8">
        <ExampleSection model={model} />
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
