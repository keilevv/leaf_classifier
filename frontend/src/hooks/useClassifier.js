import plantClassifierService from "../Services/plantClassifier";
import { useState } from "react";
function useClassifier() {
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      .getClassifications(page, limit, sortBy, sortOrder)
      .then((response) => {
        setUploads(response.data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching uploads:", error);
        setError(error);
        setIsLoading(false);
      });
  }

  function addUpload(upload) {
    setUploads((prev) => [upload, ...prev]);
  }

  return { uploadImage, getUploads, addUpload, uploads, isLoading, error };
}
export default useClassifier;
