import {
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaImage,
  FaArchive,
  FaEdit,
} from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { showNotification } from "../../../Common/Notification";
import ConfirmationModal from "../../../Common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import useAdmin from "../../../../hooks/useAdmin";
import useStore from "../../../../hooks/useStore";
import UploadModal from "../../../Upload/UploadModal";
import { formatDate, getStatusBadge } from "../../../../utils";
import ClassificationBadge from "../../../Common/Classifications/ClassificationBadge";

function ClassificationsTable({
  classifications,
  shapes,
  totalPages,
  page,
  setPage,
  pageSize,
  classificationsCount,
  onUpdateClassification = () => {},
}) {
  const { user } = useStore();
  const { updateClassification, deleteClassification } = useAdmin();
  const navigate = useNavigate();
  const [maxButtons, setMaxButtons] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({});
  const [fileName, setFileName] = useState(null);

  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    if (selectedClassification) {
      setFileName(selectedClassification?.imagePath?.split("/").pop());
      confirmModalContent();
    }
  }, [selectedClassification, actionType]);

  function confirmModalContent() {
    const filename = selectedClassification?.imagePath?.split("/").pop();
    setOpenConfirmation(true);
    switch (actionType) {
      case "verify":
        setConfirmationContent({
          title: "Verify Classification",
          message: `Verify confirmation for: ${filename}`,
          type: "warning",
          onConfirm: () => handleVerifyClassificationSubmit(),
        });
        return;
      case "archive":
        setConfirmationContent({
          title: "Archive Classification",
          message: `Archive confirmation for: ${filename}`,
          type: "warning",
          onConfirm: () => handleArchiveClassificationSubmit(),
        });
        return;
      case "delete":
        setConfirmationContent({
          title: "Delete Classification",
          message: `Delete confirmation for: ${filename}`,
          type: "warning",
          onConfirm: () => handleDeleteClassificationSubmit(),
        });
        return;
      case "reject":
        setConfirmationContent({
          title: "Reject Classification",
          message: `Reject confirmation for: ${filename}`,
          type: "warning",
          onConfirm: () => handleVerifyClassificationSubmit("REJECTED"),
        });
        return;
      default:
        setConfirmationContent({
          title: "Confirmation",
          message: `Are you sure you want to perform this action for: ${filename}`,
          type: "warning",
          onConfirm: () => {},
        });
        return;
    }
  }

  const closeViewModal = () => {
    setIsOpen(false);
    setSelectedClassification(null);
  };

  const handleViewClassification = (classification) => {
    setSelectedClassification(classification);
    setIsOpen(true);
  };

  const handleEditClassification = (classification) => {
    setSelectedClassification(classification);
    navigate(`/admin/classification/${classification.id}`);
  };

  const handleDeleteClassification = (classification) => {
    setSelectedClassification(classification);
    setActionType("delete");
  };

  const handleArchiveClassification = (classification) => {
    setSelectedClassification(classification);
    setActionType("archive");
  };

  const handleVerifyClassification = (classification, status = "REJECTED") => {
    setSelectedClassification(classification);
    if (status === "REJECTED") {
      setActionType("reject");
    } else {
      setActionType("verify");
    }
  };

  const handleVerifyClassificationSubmit = (status = "REJECTED") => {
    updateClassification(selectedClassification.id, { status })
      .then(() => {
        showNotification({
          title: "Classification verified",
          message: "Classification verified successfully",
          type: "success",
        });
        onUpdateClassification(selectedClassification);
        setOpenConfirmation(false);
      })
      .catch((error) => {
        console.error("Error verifying classification:", error);
        showNotification({
          title: "Classification verification failed",
          message: "Classification verification failed",
          type: "error",
        });
        setOpenConfirmation(false);
      });
  };

  const handleArchiveClassificationSubmit = () => {
    updateClassification(selectedClassification.id, { isArchived: true })
      .then(() => {
        showNotification({
          title: "Classification archived",
          message: fileName,
          type: "success",
        });
        onUpdateClassification(selectedClassification);
        setOpenConfirmation(false);
      })
      .catch((error) => {
        console.error("Error archiving classification:", error);
        showNotification({
          title: "Classification archiving failed",
          message: fileName,
          type: "error",
        });
        setOpenConfirmation(false);
      });
  };

  const handleDeleteClassificationSubmit = () => {
    deleteClassification(selectedClassification.id)
      .then(() => {
        showNotification({
          title: "Classification deleted",
          message: fileName,
          type: "success",
        });
        onUpdateClassification(selectedClassification);
        setOpenConfirmation(false);
      })
      .catch((error) => {
        console.error("Error deleting classification:", error);
        showNotification({
          title: "Classification deletion failed",
          message: fileName,
          type: "error",
        });
        setOpenConfirmation(false);
      });
  };

  useEffect(() => {
    function updateMaxButtons() {
      const w = window.innerWidth;
      if (w < 640) {
        setMaxButtons(5);
      } else if (w < 1024) {
        setMaxButtons(7);
      } else {
        setMaxButtons(9);
      }
    }
    updateMaxButtons();
    window.addEventListener("resize", updateMaxButtons);
    return () => window.removeEventListener("resize", updateMaxButtons);
  }, []);

  function getPageItems(current, total, max) {
    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const items = [];
    const side = Math.floor((max - 3) / 2);
    const start = Math.max(2, current - side);
    const end = Math.min(total - 1, current + side);
    items.push(1);
    if (start > 2) items.push("...");
    for (let i = start; i <= end; i++) items.push(i);
    if (end < total - 1) items.push("...");
    items.push(total);
    return items;
  }

  return (
    <div>
      {/* Classifications Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classifications.length > 0 ? (
              classifications.map((classification) => {
                const statusBadge = getStatusBadge(
                  classification.isArchived ? "ARCHIVED" : classification.status
                );
                const StatusIcon = statusBadge.icon;
                return (
                  <tr key={classification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={classification.imagePath || "/placeholder.svg"}
                        alt={classification.originalFilename}
                        className="h-12 w-12 rounded-lg object-cover bg-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {classification?.user?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {classification?.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex flex-col gap-2">
                      <ClassificationBadge
                        classification={
                          classification.scientificName +
                          " | " +
                          classification.commonName
                        }
                        confidence={classification.speciesConfidence}
                      />
                      <ClassificationBadge
                        classification={classification.shape}
                        confidence={classification.shapeConfidence}
                      />
                    </td>
                    <td className="px-6 py-4 gap-2">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-auto self-start bg-gray-100 text-gray-800`}
                        >
                          {classification.scientificName} |{" "}
                          {classification.commonName}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-auto self-start bg-gray-100 text-gray-800`}
                        >
                          {
                            shapes.find(
                              (shape) =>
                                shape.nameEn === classification.taggedShape
                            )?.nameEn
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {classification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(classification.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() =>
                            handleViewClassification(classification)
                          }
                          className=" cursor-pointer text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleEditClassification(classification)
                          }
                          className=" cursor-pointer text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        {classification.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleVerifyClassification(
                                  classification,
                                  "VERIFIED"
                                )
                              }
                              className="text-green-600 hover:text-green-900 cursor-pointer p-2 hover:bg-green-50 rounded transition-colors"
                              title="Verify"
                            >
                              <FaCheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleVerifyClassification(
                                  classification,
                                  "REJECTED"
                                )
                              }
                              className="text-red-600 hover:text-red-900 cursor-pointer p-2 hover:bg-green-50 rounded transition-colors"
                              title="Reject"
                            >
                              <FaCircleXmark className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        <button
                          disabled={user?.role !== "ADMIN"}
                          onClick={() => {
                            if (classification.isArchived) {
                              handleDeleteClassification(classification);
                            } else {
                              handleArchiveClassification(classification);
                            }
                          }}
                          className={`${
                            user?.role !== "ADMIN"
                              ? "opacity-50 cursor-not-allowed"
                              : "text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors"
                          }`}
                          title={
                            classification.isArchived ? "Delete" : "Archive"
                          }
                        >
                          {classification.isArchived ? (
                            <FaTrash className="h-4 w-4" />
                          ) : (
                            <FaArchive className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <FaImage className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No classifications found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center  flex-col-reverse gap-2 md:flex-row md:justify-between">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize) > classificationsCount.total
              ? Math.min(page * pageSize) - classifications.length
              : Math.min(page * pageSize)}{" "}
            of {classificationsCount.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className=" cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            {getPageItems(page, totalPages, maxButtons).map((item, idx) => {
              if (item === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-gray-500 select-none"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`cursor-pointer px-3 md:px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    page === item
                      ? "bg-green-600 text-white border-green-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              );
            })}
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <UploadModal
        isOpen={isOpen}
        closeModal={closeViewModal}
        selectedUpload={selectedClassification}
      />
      <ConfirmationModal
        isOpen={openConfirmation}
        closeModal={() => {
          setOpenConfirmation(false);
          setSelectedClassification(null);
          setActionType(null);
        }}
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={() => confirmationContent.onConfirm()}
      />
    </div>
  );
}

export default ClassificationsTable;
