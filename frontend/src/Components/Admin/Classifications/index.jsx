import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaImage,
  FaImages,
  FaArchive,
  FaEdit,
} from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { formatDate, getStatusBadge } from "../../../utils";
import _debounce from "lodash/debounce";
import { showNotification } from "../../Common/Notification";
import useAdmin from "../../../hooks/useAdmin";
import useStore from "../../../hooks/useStore";
import ClassificationBadge from "../../Common/Classifications/ClassificationBadge";
import RangePicker from "../../Common/RangePicker";
import UploadModal from "../../Upload/UploadModal";
import EditClassificationModal from "./EditClassificationModal";

function ClassificationsTable({ setClassificationsCount = () => {} }) {
  const { preferences } = useStore();
  const {
    getClassifications,
    classifications: classificationsData,
    pages,
    classificationsCount,
  } = useAdmin();
  // Classifications state
  const [classifications, setClassifications] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = preferences?.pageSize || 6;
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isArchived, setIsArchived] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState(null);
  const totalPages = pages;
  const [rangeFilter, setRangeFilter] = useState({ start: null, end: null });

  // Classification actions
  const handleViewClassification = (classification) => {
    setSelectedClassification(classification);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setSelectedClassification(null);
  };
  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedClassification(null);
  };

  const handleEditClassification = (classification) => {
    setSelectedClassification(classification);
    setIsEditOpen(true);
  };

  const handleDeleteClassification = (classification) => {
    showNotification({
      title: "Delete Classification",
      message: `Delete confirmation for: ${classification.filename}`,
      type: "warning",
    });
    // Simulate deletion
    setTimeout(() => {
      setClassifications((prev) =>
        prev.filter((c) => c.id !== classification.id)
      );
      showNotification({
        title: "Classification deleted successfully",
        message: "Classification deleted successfully",
        type: "success",
      });
    }, 1000);
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

  useEffect(() => {
    if (classificationsData) {
      setClassifications(classificationsData);
      setClassificationsCount(classificationsCount);
    }
  }, [classificationsData, classificationsCount]);

  useEffect(() => {
    const filters = {};
    if (searchString.length) {
      filters.search = searchString;
    }
    if (rangeFilter.start && rangeFilter.end) {
      filters.createdAt_gte = rangeFilter.start;
      filters.createdAt_lte = rangeFilter.end;
    }
    filters.status = statusFilter;
    filters.isArchived = isArchived;

    getClassifications(page, pageSize, "createdAt", "desc", filters);
  }, [page, pageSize, searchString, statusFilter, isArchived, rangeFilter]);

  function handleSearch(inputValue) {
    setSearchString(inputValue);
    setPage(1);
  }

  const debouncedSearch = useCallback(_debounce(handleSearch, 300), []);

  return (
    <>
      {" "}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <h2 className=" flex gap-2 border-b border-gray-200 text-2xl font-bold mb-4 pb-2 text-green-700 items-center">
            <FaImages />
            Classifications
          </h2>
          <RangePicker
            rangeFilter={rangeFilter}
            setRangeFilter={setRangeFilter}
            className="mb-4"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by username or classification..."
                onChange={(e) => {
                  debouncedSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                if (e.target.value === "ARCHIVED") {
                  setIsArchived(true);
                } else {
                  setIsArchived(false);
                  setStatusFilter(e.target.value);
                }
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="ALL">All Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

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
                  Filename
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
                    classification.isArchived
                      ? "ARCHIVED"
                      : classification.status
                  );
                  const StatusIcon = statusBadge.icon;
                  const filename = classification?.imagePath.split("/").pop();
                  return (
                    <tr key={classification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={classification.imagePath || "/placeholder.svg"}
                          alt={classification.originalFilename}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {classification.user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {classification.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ClassificationBadge
                          classification={classification.shape}
                          confidence={classification.shapeConfidence}
                        />
                        <ClassificationBadge
                          classification={classification.species}
                          confidence={classification.speciesConfidence}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{filename}</div>
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setPage(page)}
                    className={`cursor-pointer px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      page === page
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page === totalPages}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Modal */}
      <UploadModal
        isOpen={isOpen}
        closeModal={closeModal}
        selectedUpload={selectedClassification}
      />
      <EditClassificationModal
        isOpen={isEditOpen}
        closeModal={closeEditModal}
        selectedUpload={selectedClassification}
      />
    </>
  );
}
export default ClassificationsTable;
