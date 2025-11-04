import plantClassifierService from "../Services/plantClassifier";
import { useState } from "react";
import useStore from "../hooks/useStore";
function useClassifier() {
  const { accessToken } = useStore();
  const [uploads, setUploads] = useState([]);
  const [upload, setUpload] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(1);

  function uploadClassification(imageData) {
    setIsLoading(true);
    return plantClassifierService
      .uploadImage(imageData)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error("Failed to upload image");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
        console.error("Error uploading image:", error);
        throw error;
      });
  }

  function getUploads(page, limit, sortBy, sortOrder, filters) {
    setIsLoading(true);
    return plantClassifierService
      .getClassifications(page, limit, sortBy, sortOrder, filters, accessToken)
      .then((response) => {
        setUploads(response.data.results);
        setShapes(response.data.shapes);
        setIsLoading(false);
        setPages(response.data.pages);
      })
      .catch((error) => {
        console.error("Error fetching uploads:", error);
        setError(error);
        setIsLoading(false);
      });
  }
  function getUpload(id) {
    setIsLoading(true);
    return plantClassifierService
      .getUpload(id, accessToken)
      .then((response) => {
        setIsLoading(false);
        setUpload(response.data.result);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching upload:", error);
        setError(error);
        setIsLoading(false);
      });
  }

  function updateClassification(id, data) {
    setIsLoading(true);
    return plantClassifierService
      .updateClassification(id, data, accessToken)
      .then((response) => {
        setIsLoading(false);
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
        setIsLoading(false);
        setError(error);
        console.error("Error updating classification:", error);
        throw error;
      });
  }

  function addUpload(upload) {
    setUploads((prev) => [upload, ...prev]);
  }

  return {
    uploadClassification,
    getUploads,
    getUpload,
    addUpload,
    updateClassification,
    shapes,
    uploads,
    upload,
    isLoading,
    error,
    pages,
  };
}
export default useClassifier;
