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
