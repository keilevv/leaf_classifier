import { useState, useEffect } from "react";
import useStore from "./useStore";
import adminService from "../Services/admin";

function useAdmin() {
  const { accessToken } = useStore();
  const [classifications, setClassifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(1);

  function getClassifications(page, limit, sortBy, sortOrder) {
    setIsLoading(true);
    return adminService
      .getAdminclassifications(page, limit, sortBy, sortOrder, accessToken)
      .then((response) => {
        setClassifications(response.data.results);
        setIsLoading(false);
        setPages(response.data.pages);
      })
      .catch((error) => {
        console.error("Error fetching classifications:", error);
        setError(error);
        setIsLoading(false);
      });
  }
  return { classifications, isLoading, error, pages, getClassifications };
}
export default useAdmin;
