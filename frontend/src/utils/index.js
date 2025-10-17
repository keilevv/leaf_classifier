import {
  FaCheckCircle,
  FaFilter,
  FaTimesCircle,
  FaShieldAlt,
  FaUserCircle,
} from "react-icons/fa";
// Construct image URL from imagePath
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/vite.svg";
  const apiUrl = import.meta.env.VITE_LOCAL_PATH || "http://localhost:5000";
  const fullUrl = `${apiUrl}/${imagePath}`;
  return fullUrl;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.9) return "bg-green-100 text-green-800";
  if (confidence >= 0.7) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

// Get status badge style
export const getStatusBadge = (status) => {
  const badges = {
    verified: { color: "bg-green-100 text-green-800", icon: FaCheckCircle },
    pending: { color: "bg-yellow-100 text-yellow-800", icon: FaFilter },
    rejected: { color: "bg-red-100 text-red-800", icon: FaTimesCircle },
  };
  return badges[status] || badges.pending;
};

// Get role badge style
export const getRoleBadge = (role) => {
  const badges = {
    admin: { color: "bg-green-100 text-green-800", icon: FaShieldAlt },
    moderator: { color: "bg-blue-100 text-blue-800", icon: FaShieldAlt },
    contributor: { color: "bg-gray-100 text-gray-800", icon: FaUserCircle },
  };
  return badges[role] || badges.contributor;
};

// Classification actions
export const handleViewClassification = (classification) => {
  showNotification({
    title: "Classification Details",
    message: `Viewing classification: ${classification.filename}`,
    type: "info",
  });
};
