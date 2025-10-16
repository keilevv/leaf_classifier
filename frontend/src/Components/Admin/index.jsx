import { useState, useMemo } from "react";
import { Tab } from "@headlessui/react";
import {
  FaSearch,
  FaUsers,
  FaDatabase,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaUserCircle,
  FaImage,
  FaFilter,
} from "react-icons/fa";
import { showNotification } from "../Common/Notification";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "María García",
    email: "maria.garcia@unal.edu.co",
    role: "admin",
    classificationsCount: 45,
    joinDate: "2023-12-01T10:00:00Z",
    lastActive: "2024-01-15T10:30:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@unal.edu.co",
    role: "contributor",
    classificationsCount: 32,
    joinDate: "2023-12-05T14:00:00Z",
    lastActive: "2024-01-14T14:22:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@unal.edu.co",
    role: "contributor",
    classificationsCount: 28,
    joinDate: "2023-12-10T09:00:00Z",
    lastActive: "2024-01-13T09:15:00Z",
    status: "active",
  },
  {
    id: "4",
    name: "Juan López",
    email: "juan.lopez@unal.edu.co",
    role: "contributor",
    classificationsCount: 19,
    joinDate: "2023-12-15T11:00:00Z",
    lastActive: "2024-01-12T16:45:00Z",
    status: "active",
  },
  {
    id: "5",
    name: "Laura Fernández",
    email: "laura.fernandez@unal.edu.co",
    role: "moderator",
    classificationsCount: 67,
    joinDate: "2023-11-20T08:00:00Z",
    lastActive: "2024-01-10T18:20:00Z",
    status: "active",
  },
  {
    id: "6",
    name: "Diego Vargas",
    email: "diego.vargas@unal.edu.co",
    role: "contributor",
    classificationsCount: 15,
    joinDate: "2023-12-20T13:00:00Z",
    lastActive: "2024-01-08T12:30:00Z",
    status: "inactive",
  },
];

export default function AdminPage() {
  // Classifications state
  const [classifications, setClassifications] = useState(mockClassifications);
  const [classificationSearch, setClassificationSearch] = useState("");
  const [classificationPage, setClassificationPage] = useState(1);
  const [classificationPageSize] = useState(5);
  const [classificationStatusFilter, setClassificationStatusFilter] =
    useState("all");

  // Users state
  const [users, setUsers] = useState(mockUsers);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize] = useState(5);
  const [userRoleFilter, setUserRoleFilter] = useState("all");

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

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase());

      const matchesRole =
        userRoleFilter === "all" || user.role === userRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (userPage - 1) * userPageSize;
    return filteredUsers.slice(startIndex, startIndex + userPageSize);
  }, [filteredUsers, userPage, userPageSize]);

  const userTotalPages = Math.ceil(filteredUsers.length / userPageSize);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const badges = {
      verified: { color: "bg-green-100 text-green-800", icon: FaCheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: FaFilter },
      rejected: { color: "bg-red-100 text-red-800", icon: FaTimesCircle },
    };
    return badges[status] || badges.pending;
  };

  // Get role badge style
  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: "bg-green-100 text-green-800", icon: FaShieldAlt },
      moderator: { color: "bg-blue-100 text-blue-800", icon: FaShieldAlt },
      contributor: { color: "bg-gray-100 text-gray-800", icon: FaUserCircle },
    };
    return badges[role] || badges.contributor;
  };

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

  // User actions
  const handleEditUser = (user) => {
    showNotification({
      title: "User Management",
      message: `Edit user: ${user.name}`,
      type: "info",
    });
  };

  const handleDeleteUser = (user) => {
    showNotification({
      title: "Delete User",
      message: `Delete confirmation for user: ${user.name}`,
      type: "warning",
    });
    // Simulate deletion
    setTimeout(() => {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showNotification({
        title: "User deleted successfully",
        message: "User deleted successfully",
        type: "success",
      });
    }, 1000);
  };

  const handleChangeRole = (user, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
    );
    showNotification({
      title: "User role changed",
      message: `User role changed to ${newRole}`,
      type: "success",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-green-100">Manage users and classifications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {classifications.length}
            </div>
            <div className="text-sm text-gray-600">Total Classifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {classifications.filter((c) => c.status === "verified").length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {classifications.filter((c) => c.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-green-900/20 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 cursor-pointer ",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-700"
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <FaDatabase className="h-4 w-4" />
                <span className="font-bold">Classifications</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 cursor-pointer",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-700"
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <FaUsers className="h-4 w-4" />
                <span className="font-bold">Users</span>
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Classifications Panel */}
            <Tab.Panel>
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
                          const statusBadge = getStatusBadge(
                            classification.status
                          );
                          const StatusIcon = statusBadge.icon;
                          return (
                            <tr
                              key={classification.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                  src={
                                    classification.imageUrl ||
                                    "/placeholder.svg"
                                  }
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
                                      width: `${
                                        classification.confidence * 100
                                      }%`,
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
                                        handleVerifyClassification(
                                          classification
                                        )
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
                      Showing{" "}
                      {(classificationPage - 1) * classificationPageSize + 1} to{" "}
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
                        disabled={
                          classificationPage === classificationTotalPages
                        }
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>

            {/* Users Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Search and Filters */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value);
                          setUserPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => {
                        setUserRoleFilter(e.target.value);
                        setUserPage(1);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="contributor">Contributor</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Classifications
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => {
                          const roleBadge = getRoleBadge(user.role);
                          const RoleIcon = roleBadge.icon;
                          return (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                      <span className="text-green-600 font-medium text-sm">
                                        {user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.color}`}
                                >
                                  <RoleIcon className="h-3 w-3 mr-1" />
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FaDatabase className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm font-medium text-gray-900">
                                    {user.classificationsCount}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.joinDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.lastActive)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit"
                                  >
                                    <FaEdit className="h-4 w-4" />
                                  </button>
                                  <select
                                    value={user.role}
                                    onChange={(e) =>
                                      handleChangeRole(user, e.target.value)
                                    }
                                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    title="Change Role"
                                  >
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="contributor">
                                      Contributor
                                    </option>
                                  </select>
                                  <button
                                    onClick={() => handleDeleteUser(user)}
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
                            <FaUsers className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No users found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {userTotalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {(userPage - 1) * userPageSize + 1} to{" "}
                      {Math.min(userPage * userPageSize, filteredUsers.length)}{" "}
                      of {filteredUsers.length} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setUserPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={userPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from(
                        { length: userTotalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setUserPage(page)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            userPage === page
                              ? "bg-green-600 text-white border-green-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setUserPage((prev) =>
                            Math.min(userTotalPages, prev + 1)
                          )
                        }
                        disabled={userPage === userTotalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
