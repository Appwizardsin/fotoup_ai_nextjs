"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiDownload, FiX } from "react-icons/fi";
import withAuth from "../components/withAuth";
import { users } from "@/services/api";
import Image from "next/image";

function MyImagesPage({ user }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  const fetchImages = async (page) => {
    try {
      setLoading(true);
      const data = await users.getUserImages(page, 20, "generated");
      setImages(data.images);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to load images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const cleanImageUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}${urlObj.pathname}`;
    } catch (e) {
      return url;
    }
  };

  async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Images</h1>

        {images.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>You haven&apos;t generated any images yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
              {images.map((image) => (
                <div
                  key={image._id}
                  className="relative group rounded-lg overflow-hidden bg-gray-800 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    width={400}
                    height={400}
                    src={cleanImageUrl(image.url)}
                    alt="Generated image"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">
                      Created: {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await downloadImage(cleanImageUrl(image.url));
                      }}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <FiDownload className="inline-block mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Viewer Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedImage(null)}
              >
                <div
                  className="relative max-w-3xl max-h-[80vh] bg-gray-800 rounded-lg p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-4 -right-4 bg-gray-800 text-white hover:text-gray-300 p-2 rounded-full z-10"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                  <div className="h-full overflow-auto">
                    <Image
                      width={400}
                      height={400}
                      src={cleanImageUrl(selectedImage.url)}
                      alt="Selected image"
                      className="w-auto h-[50vh] md:h-[60vh] rounded-lg object-contain"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(cleanImageUrl(selectedImage.url));
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FiDownload className="inline-block mr-1" />
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(MyImagesPage);
