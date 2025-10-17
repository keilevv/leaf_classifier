import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaDatabase,
  FaEdit,
} from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
import { formatDate, getRoleBadge } from "../../../utils";
import { showNotification } from "../../Common/Notification";

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

function UsersTable({ setHeaderUsers = () => {} }) {
  // Users state
  const [users, setUsers] = useState(mockUsers);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize] = useState(5);
  const [userRoleFilter, setUserRoleFilter] = useState("all");

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

  useEffect(() => {
    if (users.length) {
      setHeaderUsers(users);
    }
  }, [users]);

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
                            <option value="contributor">Contributor</option>
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
              {Math.min(userPage * userPageSize, filteredUsers.length)} of{" "}
              {filteredUsers.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setUserPage((prev) => Math.max(1, prev - 1))}
                disabled={userPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: userTotalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
              <button
                onClick={() =>
                  setUserPage((prev) => Math.min(userTotalPages, prev + 1))
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
    </>
  );
}
export default UsersTable;
