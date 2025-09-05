import plantClassifierService from "../Services/plantClassifier";
import { useState } from "react";
import useStore from "../hooks/useStore";
function useClassifier() {
  const { accessToken } = useStore();
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(1);

  function uploadImage(imageData) {
    return plantClassifierService
      .uploadImage(imageData)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error("Failed to upload image");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        throw error;
      });
  }

  function getUploads(page, limit, sortBy, sortOrder) {
    return plantClassifierService
      .getClassifications(page, limit, sortBy, sortOrder, accessToken)
      .then((response) => {
        setUploads(response.data.results);
        setIsLoading(false);
        setPages(response.data.pages);
      })
      .catch((error) => {
        console.error("Error fetching uploads:", error);
        setError(error);
        setIsLoading(false);
      });
  }
  function updateClassification(id, data) {
    return plantClassifierService
      .updateClassification(id, data, accessToken)
      .then((response) => {
        if (response.status === 200) {
          // Update the local state
          setUploads((prevUploads) =>
            prevUploads.map((upload) =>
              upload.id === id ? { ...upload, ...data } : upload
            )
          );
          return response.data;
        } else {
          throw new Error("Failed to update classification");
        }
      })
      .catch((error) => {
        console.error("Error updating classification:", error);
        throw error;
      });
  }

  function addUpload(upload) {
    setUploads((prev) => [upload, ...prev]);
  }

  return {
    uploadImage,
    getUploads,
    addUpload,
    updateClassification,
    uploads,
    isLoading,
    error,
    pages,
  };
}
export default useClassifier;
