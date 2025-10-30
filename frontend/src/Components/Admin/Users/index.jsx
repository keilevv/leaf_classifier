import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaDatabase,
  FaEdit,
  FaUsers,
  FaFilter,
  FaArchive,
} from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { formatDate, getRoleBadge } from "../../../utils";
import _debounce from "lodash/debounce";
import { showNotification } from "../../Common/Notification";
import ConfirmationModal from "../../Common/ConfirmationModal";
import useAdmin from "../../../hooks/useAdmin";
import useStore from "../../../hooks/useStore";
import RangePicker from "../../Common/RangePicker";
import { useNavigate } from "react-router-dom";

function UsersTable({ setUsersCount = () => {} }) {
  const navigate = useNavigate();
  const { preferences } = useStore();
  // Users state
  const [users, setUsers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = preferences?.pageSize || 6;
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [isArchived, setIsArchived] = useState(false);
  const { users: usersData, getUsers, usersCount, updateUser } = useAdmin();
  const [rangeFilter, setRangeFilter] = useState({ start: null, end: null });
  const [showFilters, setShowFilters] = useState(false);
  const [maxButtons, setMaxButtons] = useState(5);
  const [newRole, setNewRole] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmationContent, setConfirmationContent] = useState({
    title: "",
    message: "",
    type: "",
    onConfirm: () => {},
  });
  const [actionType, setActionType] = useState(null);

  const totalPages = Math.ceil(users.length / pageSize);

  function confirmModalContent(actionType) {
    setOpenConfirm(true);
    switch (actionType) {
      case "archive":
        setConfirmationContent({
          title: "Archive User",
          message: `Archive confirmation for user: ${selectedUser?.fullName}`,
          type: "warning",
          onConfirm: () => handleArchiveUser(selectedUser),
        });
        return;
      case "delete":
        setConfirmationContent({
          title: "Delete User",
          message: `Delete confirmation for user: ${selectedUser?.fullName}`,
          type: "warning",
          onConfirm: () => handleDeleteUser(selectedUser),
        });
        return;
      case "changeRole":
        setConfirmationContent({
          title: "Change Role",
          message: `Change role confirmation for user: ${selectedUser?.fullName} to ${newRole}`,
          type: "warning",
          onConfirm: () => handleChangeRole(selectedUser, newRole),
        });
        return;
      default:
        setConfirmationContent({
          title: "Confirmation",
          message: `Are you sure you want to perform this action for user: ${userselectedUser?.fullName}`,
          type: "warning",
          onConfirm: () => {},
        });
        return;
    }
  }

  useEffect(() => {
    if (selectedUser) {
      confirmModalContent(actionType);
    }
  }, [selectedUser, actionType]);

  // User actions
  const handleEditUser = (user) => {
    navigate(`/admin/user/${user.id}`);
  };

  const handleDeleteUser = (user) => {
    showNotification({
      title: "Delete User",
      message: `Delete confirmation for user: ${userselectedUser?.fullName}`,
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

  const handleArchiveUser = (user) => {
    updateUser(user.id, { isArchived: true })
      .then(() => {
        showNotification({
          title: "User archived",
          message: user.fullName,
          type: "success",
        });
        setOpenConfirm(false);
      })
      .catch((error) => {
        console.error("Error archiving user:", error);
        showNotification({
          title: "User archiving failed",
          message: user.fullName,
          type: "error",
        });
        setOpenConfirm(false);
      });
  };

  const handleChangeRole = (user, newRole) => {
    updateUser(user.id, { role: newRole })
      .then(() => {
        // Refresh users list with current filters
        const filters = {
          ...(searchString.length && { search: searchString }),
          role: userRoleFilter,
          isArchived,
          ...(rangeFilter.start &&
            rangeFilter.end && {
              createdAt_gte: rangeFilter.start,
              createdAt_lte: rangeFilter.end,
            }),
        };

        return getUsers(page, pageSize, "createdAt", "desc", filters);
      })
      .then(() => {
        setOpenConfirm(false);
        showNotification({
          title: "User role changed",
          message: newRole,
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error updating user role:", error);
        showNotification({
          title: "User role change failed",
          message: user.fullName,
          type: "error",
        });
        setOpenConfirm(false);
      });
  };

  const closeModal = () => {
    setOpenConfirm(false);
    setConfirmationContent({
      title: "",
      message: "",
      type: "",
      onConfirm: () => {},
    });
    setSelectedUser(null);
  };

  useEffect(() => {
    const filters = {};
    if (searchString.length) {
      filters.search = searchString;
    }
    filters.role = userRoleFilter;
    filters.isArchived = isArchived;
    if (rangeFilter.start && rangeFilter.end) {
      filters.createdAt_gte = rangeFilter.start;
      filters.createdAt_lte = rangeFilter.end;
    }
    getUsers(page, pageSize, "createdAt", "desc", filters);
  }, [page, pageSize, userRoleFilter, searchString, isArchived, rangeFilter]);

  useEffect(() => {
    if (usersData) {
      setUsersCount({ total: usersCount.total });
      setUsers(usersData);
    }
  }, [usersData, usersCount]);

  function handleSearch(inputValue) {
    setSearchString(inputValue);
    setPage(1);
  }

  const debouncedSearch = useCallback(_debounce(handleSearch, 300), []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
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
    <>
      {" "}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <h2 className=" flex gap-2 border-b border-gray-200 text-2xl font-bold mb-4 pb-2 text-green-700 items-center">
            <FaUsers />
            Users
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex gap-2 items-center text-green-700 mt-1 border cursor-pointer border-green-700 px-2 py-1 w-fit hover:bg-green-100 rounded"
          >
            <FaFilter /> Filters
          </button>
          <div
            className="transition-all duration-300 max-h-0 overflow-hidden mt-4"
            style={{ maxHeight: showFilters ? "500px" : "0px" }}
          >
            <RangePicker setRangeFilter={setRangeFilter} className="mb-4" />
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <select
                value={userRoleFilter}
                onChange={(e) => {
                  if (e.target.value === "ARCHIVED") {
                    setIsArchived(true);
                  } else {
                    setIsArchived(false);
                    setUserRoleFilter(e.target.value);
                  }
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="ALL">All Roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="MODERATOR">Moderator</option>
                <option value="CONTRIBUTOR">Contributor</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
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
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th> */}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const RoleIcon = roleBadge.icon;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-medium text-sm">
                                {user.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
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
                            {user.classificationCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastActive)}
                      </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="cursor-pointer text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <select
                            value={user.role}
                            onChange={(e) => {
                              setSelectedUser(user);
                              setNewRole(e.target.value);
                              setActionType("changeRole");
                            }}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                            title="Change Role"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="MODERATOR">Moderator</option>
                            <option value="CONTRIBUTOR">Contributor</option>
                            <option value="USER">User</option>
                          </select>
                          {/* <button
                            disabled={user?.role !== "ADMIN"}
                            onClick={() => {
                              setSelectedUser(user);
                              if (user.isArchived) {
                                setActionType("delete");
                              } else {
                                setActionType("archive");
                              }
                            }}
                            className={`${
                              user?.role !== "ADMIN"
                                ? "opacity-50 cursor-not-allowed"
                                : "text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors"
                            }`}
                            title={user.isArchived ? "Delete" : "Archive"}
                          >
                            {user.isArchived ? (
                              <FaTrash className="h-4 w-4" />
                            ) : (
                              <FaArchive className="h-4 w-4" />
                            )}
                          </button> */}
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
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize) > usersCount
                ? Math.min(page * pageSize) - users.length
                : Math.min(page * pageSize)}{" "}
              of {usersCount} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className={`px-3 md:px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
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
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={() => confirmationContent.onConfirm(selectedUser)}
        closeModal={closeModal}
        isOpen={openConfirm}
      />
    </>
  );
}
export default UsersTable;
