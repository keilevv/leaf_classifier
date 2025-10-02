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
import useStore from "../../../hooks/useStore";
import { showNotification } from "../../Common/Notification";
import UploadCard from "./UploadCard";

export default function UploadHistory() {
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const { getUploads, uploads, isLoading, pages, updateClassification } =
    useClassifier();
  const { preferences } = useStore();

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
    getUploads(page, preferences.pageSize, "createdAt", "desc");
  }, [page]);

  const onConfirmArchive = () => {
    updateClassification(selectedUpload.id, { isArchived: true })
      .then(() => {
        // Refresh uploads after archiving
        showNotification({ message: "Upload archived", type: "success" });
        getUploads(page, preferences.pageSize, "createdAt", "desc");
        setOpenConfirm(false);
        closeModal();
      })
      .catch((error) => {
        showNotification({ message: error.response.data.error, type: "error" });
      });
  };

  if (uploads.length === 0 && !isLoading) {
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

      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <FaSpinner className="md:h-10 md:w-10 h-6 w-6 text-green-600 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {uploads.map((upload) => {
            return (
              <UploadCard
                key={upload.id}
                upload={upload}
                openModal={openModal}
                openConfirmModal={openConfirmModal}
              />
            );
          })}
        </div>
      )}

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
