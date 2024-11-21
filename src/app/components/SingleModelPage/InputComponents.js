'use client';

import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import Image from 'next/image';
import { media } from "@/services/api";

export const ImageInput = ({
  field,
  value,
  onChange,
  isUploading,
  setIsUploading,
}) => {
  const onDrop = async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      const data = await media.upload(file);
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        {field.displayName}
      </label>
      <div className="relative">
        {value ? (
          <div className="relative w-full h-28 sm:h-40 group">
            <div className="relative w-full h-full">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-contain rounded-lg border border-gray-700 bg-gray-800"
              />
            </div>
            <div
              {...getRootProps()}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                  <span className="text-white text-sm">Uploading...</span>
                </div>
              ) : (
                <>
                  <FiUpload className="w-8 h-8 text-white mb-2" />
                  <span className="text-white text-sm">Change Image</span>
                </>
              )}
              <input {...getInputProps()} />
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center w-full h-28 sm:h-40 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-750 transition-colors"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center pt-2 pb-2 sm:pt-5 sm:pb-6">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                  <span className="text-gray-400">Uploading...</span>
                </div>
              ) : (
                <>
                  <FiUpload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-2 sm:mb-4" />
                  <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-400">
                    {isDragActive ? (
                      <span>Drop the image here</span>
                    ) : (
                      <span>
                        <span className="font-semibold block sm:inline">
                          Click to upload
                        </span>
                        <span className="hidden sm:inline">
                          {" "}
                          or drag and drop
                        </span>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or Webp</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TextInput = ({ field, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-200">
      {field.displayName}
    </label>
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={
        field.description || `Enter ${field.displayName.toLowerCase()}...`
      }
      className="w-full border border-gray-700 bg-gray-800 rounded-lg p-2 h-32 text-gray-200 placeholder-gray-500"
    />
  </div>
);

export const NumberInput = ({ field, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-200">
      {field.displayName}
    </label>
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      min={field.min}
      max={field.max}
      className="w-full border border-gray-700 bg-gray-800 rounded-lg p-2 text-gray-200"
    />
    {field.description && (
      <p className="text-sm text-gray-400">{field.description}</p>
    )}
  </div>
);

export const BooleanInput = ({ field, value, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id={field.key}
      checked={value || false}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600"
    />
    <label htmlFor={field.key} className="text-sm font-medium text-gray-200">
      {field.displayName}
    </label>
    {field.description && (
      <p className="text-sm text-gray-400">{field.description}</p>
    )}
  </div>
);

export const PreDefinedImagesInput = ({ field, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-200">
      {field.displayName}
    </label>
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-700 bg-gray-800 rounded-lg p-2 text-gray-200"
    >
      <option value="">Select {field.displayName.toLowerCase()}</option>
      {field.preDefinedImages.map((image, index) => (
        <option key={index} value={image}>
          Image {index + 1}
        </option>
      ))}
    </select>
    {value && (
      <div className="relative w-full h-48">
        <Image
          src={value}
          alt="Selected"
          fill
          className="object-contain rounded-lg border border-gray-700 bg-gray-800"
        />
      </div>
    )}
  </div>
);

export const VideoInput = ({ field, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-200">
      {field.displayName}
    </label>
    <input
      type="file"
      accept="video/*"
      onChange={(e) => onChange(e.target.files[0])}
      className="w-full border border-gray-700 bg-gray-800 rounded-lg p-2 text-gray-200"
    />
    {value && (
      <video
        controls
        className="w-full rounded-lg border border-gray-700 bg-gray-800"
      >
        <source src={URL.createObjectURL(value)} type={value.type} />
        Your browser does not support the video tag.
      </video>
    )}
    {field.description && (
      <p className="text-sm text-gray-400">{field.description}</p>
    )}
  </div>
);

export const AudioInput = ({ field, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-200">
      {field.displayName}
    </label>
    <input
      type="file"
      accept="audio/*"
      onChange={(e) => onChange(e.target.files[0])}
      className="w-full border border-gray-700 bg-gray-800 rounded-lg p-2 text-gray-200"
    />
    {value && (
      <audio controls className="w-full mt-2">
        <source src={URL.createObjectURL(value)} type={value.type} />
        Your browser does not support the audio element.
      </audio>
    )}
    {field.description && (
      <p className="text-sm text-gray-400">{field.description}</p>
    )}
  </div>
); 