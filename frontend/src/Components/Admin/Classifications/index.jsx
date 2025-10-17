import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
import { formatDate, getStatusBadge } from "../../../utils";
import { showNotification } from "../../Common/Notification";

// Mock data for classifications
const mockClassifications = [
  {
    id: "1",
    imageUrl: "/placeholder.svg?height=100&width=100",
    filename: "maple_leaf.jpg",
    userName: "María García",
    userEmail: "maria.garcia@unal.edu.co",
    classification: "Acer saccharum (Sugar Maple)",
    confidence: 0.94,
    uploadDate: "2024-01-15T10:30:00Z",
    status: "verified",
  },
  {
    id: "2",
    imageUrl: "/placeholder.svg?height=100&width=100",
    filename: "oak_leaf.jpg",
    userName: "Carlos Rodríguez",
    userEmail: "carlos.rodriguez@unal.edu.co",
    classification: "Quercus alba (White Oak)",
    confidence: 0.87,
    uploadDate: "2024-01-14T14:22:00Z",
    status: "pending",
  },
  {
    id: "3",
    imageUrl: "/placeholder.svg?height=100&width=100",
    filename: "birch_leaf.jpg",
    userName: "Ana Martínez",
    userEmail: "ana.martinez@unal.edu.co",
    classification: "Betula pendula (Silver Birch)",
    confidence: 0.91,
    uploadDate: "2024-01-13T09:15:00Z",
    status: "verified",
  },
  {
    id: "4",
    imageUrl: "/placeholder.svg?height=100&width=100",
    filename: "beech_leaf.jpg",
    userName: "Juan López",
    userEmail: "juan.lopez@unal.edu.co",
    classification: "Fagus sylvatica (European Beech)",
    confidence: 0.88,
    uploadDate: "2024-01-12T16:45:00Z",
    status: "rejected",
  },
  {
    id: "5",
    imageUrl: "/placeholder.svg?height=100&width=100",
    filename: "elm_leaf.jpg",
    userName: "María García",
    userEmail: "maria.garcia@unal.edu.co",
    classification: "Ulmus americana (American Elm)",
    confidence: 0.92,
    uploadDate: "2024-01-11T11:20:00Z",
    status: "verified",
  },
  {
    id: "6",
    imageUrl: "/placeholder.svg?height=100&width=100",
    filename: "pine_needle.jpg",
    userName: "Carlos Rodríguez",
    userEmail: "carlos.rodriguez@unal.edu.co",
    classification: "Pinus sylvestris (Scots Pine)",
    confidence: 0.85,
    uploadDate: "2024-01-10T13:30:00Z",
    status: "pending",
  },
  {
    id: "7",
    imageUrl: "/placeholder.svg?height=100&width=100",
    filename: "willow_leaf.jpg",
    userName: "Ana Martínez",
    userEmail: "ana.martinez@unal.edu.co",
    classification: "Salix babylonica (Weeping Willow)",
    confidence: 0.89,
    uploadDate: "2024-01-09T08:10:00Z",
    status: "verified",
  },
  {
    id: "8",
    imageUrl: "/placeholder.svg?height=100&width=100",
    filename: "poplar_leaf.jpg",
    userName: "Juan López",
    userEmail: "juan.lopez@unal.edu.co",
    classification: "Populus tremula (Aspen)",
    confidence: 0.86,
    uploadDate: "2024-01-08T15:55:00Z",
    status: "pending",
  },
];

function ClassificationsTable({ setHeaderClassifications = () => {} }) {
  // Classifications state
  const [classifications, setClassifications] = useState(mockClassifications);
  const [classificationSearch, setClassificationSearch] = useState("");
  const [classificationPage, setClassificationPage] = useState(1);
  const [classificationPageSize] = useState(5);
  const [classificationStatusFilter, setClassificationStatusFilter] =
    useState("all");

  // Filter classifications
  const filteredClassifications = useMemo(() => {
    return classifications.filter((classification) => {
      const matchesSearch =
        classification.userName
          .toLowerCase()
          .includes(classificationSearch.toLowerCase()) ||
        classification.classification
          .toLowerCase()
          .includes(classificationSearch.toLowerCase()) ||
        classification.userEmail
          .toLowerCase()
          .includes(classificationSearch.toLowerCase());

      const matchesStatus =
        classificationStatusFilter === "all" ||
        classification.status === classificationStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [classifications, classificationSearch, classificationStatusFilter]);

  // Paginate classifications
  const paginatedClassifications = useMemo(() => {
    const startIndex = (classificationPage - 1) * classificationPageSize;
    return filteredClassifications.slice(
      startIndex,
      startIndex + classificationPageSize
    );
  }, [filteredClassifications, classificationPage, classificationPageSize]);

  const classificationTotalPages = Math.ceil(
    filteredClassifications.length / classificationPageSize
  );

  // Classification actions
  const handleViewClassification = (classification) => {
    showNotification({
      title: "Classification Details",
      message: `Viewing classification: ${classification.filename}`,
      type: "info",
    });
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
    if (classifications.length) {
      setHeaderClassifications(classifications);
    }
  }, [classifications]);

  return (
    <>
      {" "}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by username or classification..."
                value={classificationSearch}
                onChange={(e) => {
                  setClassificationSearch(e.target.value);
                  setClassificationPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <select
              value={classificationStatusFilter}
              onChange={(e) => {
                setClassificationStatusFilter(e.target.value);
                setClassificationPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
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
                  Confidence
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
              {paginatedClassifications.length > 0 ? (
                paginatedClassifications.map((classification) => {
                  const statusBadge = getStatusBadge(classification.status);
                  const StatusIcon = statusBadge.icon;
                  return (
                    <tr key={classification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={classification.imageUrl || "/placeholder.svg"}
                          alt={classification.filename}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {classification.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {classification.userEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {classification.classification}
                        </div>
                        <div className="text-sm text-gray-500">
                          {classification.filename}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {Math.round(classification.confidence * 100)}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${classification.confidence * 100}%`,
                            }}
                          />
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
                        {formatDate(classification.uploadDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleViewClassification(classification)
                            }
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="View"
                          >
                            <FaEye className="h-4 w-4" />
                          </button>
                          {classification.status === "pending" && (
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
                            onClick={() =>
                              handleDeleteClassification(classification)
                            }
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="h-4 w-4" />
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
        {classificationTotalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(classificationPage - 1) * classificationPageSize + 1} to{" "}
              {Math.min(
                classificationPage * classificationPageSize,
                filteredClassifications.length
              )}{" "}
              of {filteredClassifications.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setClassificationPage((prev) => Math.max(1, prev - 1))
                }
                disabled={classificationPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              {Array.from(
                { length: classificationTotalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setClassificationPage(page)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    classificationPage === page
                      ? "bg-green-600 text-white border-green-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setClassificationPage((prev) =>
                    Math.min(classificationTotalPages, prev + 1)
                  )
                }
                disabled={classificationPage === classificationTotalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default ClassificationsTable;
