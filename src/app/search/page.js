"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiLoader } from "react-icons/fi";
import ModelCard from "../components/ModelCard";
import { models } from "@/services/api";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modelList, setModelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch models when debounced query changes
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await models.getAll({
          search: debouncedQuery,
          sort: "popularity",
        });
        setModelList(response);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError("Failed to load models");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [debouncedQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI models..."
            className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="text-center text-red-500 py-4">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-blue-500 hover:text-blue-400"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Searching models...</p>
        </div>
      ) : modelList.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          {searchQuery
            ? "No models found matching your search"
            : "Start typing to search models"}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-6">
          {modelList.map((model) => (
            <Link href={`/model/${model._id}`} key={model._id}>
              <ModelCard
                modelId={model._id}
                title={model.name}
                description={model.description}
                imageUrl={model.mainImage}
                runCount={model.runCount}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
