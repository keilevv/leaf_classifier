"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaImage, FaEye, FaCalendarAlt, FaTimes } from "react-icons/fa";

export default function UploadHistory({ uploads }) {
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Construct image URL from imagePath
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/vite.svg";
    const apiUrl = import.meta.env.VITE_LOCAL_PATH || "http://localhost:3000";
    const fullUrl = `${apiUrl}/${imagePath}`;
    return fullUrl;
  };

  // Test URL construction
  if (uploads.length > 0) {
    const testUrl = getImageUrl(uploads[0].imagePath);
    console.log("Test URL for first upload:", testUrl);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800";
    if (confidence >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const openModal = (upload) => {
    setSelectedUpload(upload);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUpload(null);
  };

  if (uploads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <FaImage className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No uploads yet
          </h3>
          <p className="text-gray-500 text-center">
            Upload your first plant leaf image to see classification results
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload History
          </h2>
          <p className="text-gray-600 mt-1">
            View your previous plant leaf classifications and results
          </p>
        </div>
      </div>

      {/* Debug info */}
      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Number of uploads: {uploads.length}</p>
        <p>First upload imagePath: {uploads[0]?.imagePath}</p>
        <p>
          First upload URL:{" "}
          {uploads[0] ? getImageUrl(uploads[0].imagePath) : "N/A"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative" style={{ height: "200px" }}>
              <img
                src={getImageUrl(upload.imagePath)}
                alt={upload.originalFilename}
                className="w-full h-full object-cover"
                style={{ border: "1px solid #ccc" }}
                onError={(e) => {
                  console.error("Failed to load image:", e.target.src);
                  e.target.src = "/vite.svg";
                }}
                onLoad={() => {
                  console.log("Successfully loaded image:", upload.imagePath);
                }}
              />
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 truncate">
                    {upload.originalFilename}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FaCalendarAlt className="h-3 w-3 mr-1" />
                    {formatDate(upload.createdAt)}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Classification:
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {upload.classification}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(
                      upload.confidence
                    )}`}
                  >
                    {Math.round(upload.confidence * 100)}% confident
                  </span>

                  <button
                    onClick={() => openModal(upload)}
                    className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaEye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {selectedUpload?.originalFilename}
                    </Dialog.Title>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>

                  {selectedUpload && (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <img
                          src={getImageUrl(selectedUpload.imagePath)}
                          alt={selectedUpload.originalFilename}
                          className="max-w-full max-h-96 rounded-lg object-contain"
                          onError={(e) => {
                            console.error(
                              "Failed to load modal image:",
                              e.target.src
                            );
                            e.target.src = "/vite.svg";
                          }}
                          onLoad={() => {
                            console.log(
                              "Successfully loaded modal image:",
                              selectedUpload.imagePath
                            );
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            Classification:
                          </p>
                          <p className="text-gray-700">
                            {selectedUpload.classification}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Confidence:
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(
                              selectedUpload.confidence
                            )}`}
                          >
                            {Math.round(selectedUpload.confidence * 100)}%
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Upload Date:
                          </p>
                          <p className="text-gray-700">
                            {formatDate(selectedUpload.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            File Size:
                          </p>
                          <p className="text-gray-700">Image file</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
