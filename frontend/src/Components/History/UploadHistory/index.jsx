import { useState, useEffect } from "react";
import {
  FaImage,
  FaEye,
  FaCalendarAlt,
  FaSpinner,
  FaArchive,
} from "react-icons/fa";
import UploadModal from "../../Upload/UploadModal";
import ConfirmationModal from "../../Common/ConfirmationModal";
import { getConfidenceColor, getImageUrl, formatDate } from "../../../utils";
import Pagination from "../Pagination";
import useClassifier from "../../../hooks/useClassifier";
import { showNotification } from "../../Common/Notification";

export default function UploadHistory() {
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const { getUploads, uploads, isLoading, pages, updateClassification } =
    useClassifier();

  // Test URL construction
  if (uploads.length > 0) {
    const testUrl = getImageUrl(uploads[0].imagePath);
  }

  const openModal = (upload) => {
    setSelectedUpload(upload);
    setIsOpen(true);
  };

  const openConfirmModal = (upload) => {
    setSelectedUpload(upload);
    setOpenConfirm(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUpload(null);
  };

  useEffect(() => {
    getUploads(page, 10, "createdAt", "desc");
  }, [page]);

  const onConfirmArchive = () => {
    updateClassification(selectedUpload.id, { isArchived: true })
      .then(() => {
        // Refresh uploads after archiving
        showNotification({ message: "Upload archived", type: "success" });
        getUploads(page, 10, "createdAt", "desc");
        setOpenConfirm(false);
        closeModal();
      })
      .catch((error) => {
        showNotification({ message: error.response.data.error, type: "error" });
      });
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
      {/* <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Number of uploads: {uploads.length}</p>
        <p>First upload imagePath: {uploads[0]?.imagePath}</p>
        <p>
          First upload URL:{" "}
          {uploads[0] ? getImageUrl(uploads[0].imagePath) : "N/A"}
        </p>
      </div> */}
      <Pagination page={page} setPage={setPage} totalPages={pages} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <FaSpinner className="h-6 w-6 text-gray-400 animate-spin mx-auto" />
        ) : (
          uploads.map((upload) => {
            return (
              <div
                key={upload.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative" style={{ height: "200px" }}>
                  <img
                    src={upload.imageUrl}
                    alt={upload.originalFilename}
                    className="w-full h-full object-cover"
                    style={{ border: "1px solid #ccc" }}
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

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-auto self-start ${getConfidenceColor(
                          upload.confidence
                        )}`}
                      >
                        {Math.round(upload.confidence * 100)}% confident
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => openConfirmModal(upload)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <FaArchive className="h-4 w-4" />
                          <span>Archive</span>
                        </button>
                        <button
                          onClick={() => openModal(upload)}
                          className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <FaEye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Modal */}
      <UploadModal
        isOpen={isOpen}
        closeModal={closeModal}
        selectedUpload={selectedUpload}
      />
      <ConfirmationModal
        message={
          "Are you sure you want to archive this upload? This action cannot be undone."
        }
        isOpen={openConfirm}
        closeModal={() => setOpenConfirm(false)}
        onConfirm={onConfirmArchive}
      />
    </div>
  );
}
