import { formatDate, getStatusBadge } from "../../../../utils";
import ClassificationBadge from "../../../Common/Classifications/ClassificationBadge";

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

function ClassificationsTable({ classifications }) {
  const handleEditClassification = (classification) => {
    setSelectedClassification(classification);
    navigate(`/admin/classification/${classification.id}`);
  };

  const handleDeleteClassification = (classification) => {
    showNotification({
      title: "Delete Classification",
      message: `Delete confirmation for: ${classification.filename}`,
      type: "warning",
    });
  };

  const handleArchiveClassification = (classification) => {};

  const handleVerifyClassification = (classification) => {
    setClassifications((prev) =>
      prev.map((c) =>
        c.id === classification.id ? { ...c, status: "verified" } : c
      )
    );
    showNotification({
      title: "Classification verified",
      message: "Classification verified successfully",
      type: "success",
    });
  };

  return (
    <div>
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
                          <button
                            onClick={() =>
                              handleVerifyClassification(classification)
                            }
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                            title="Verify"
                          >
                            <FaCheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (classification.isArchived) {
                              handleDeleteClassification(classification);
                            } else {
                              handleArchiveClassification(classification);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
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
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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
    </div>
  );
}

export default ClassificationsTable;
