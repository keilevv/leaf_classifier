import { useState, useEffect } from "react";
import useStore from "./useStore";
import adminService from "../Services/admin";

function useAdmin() {
  const { accessToken } = useStore();
  const [classifications, setClassifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(1);

  function getClassifications(page, limit, sortBy, sortOrder) {
    setIsLoading(true);
    return adminService
      .getAdminclassifications(page, limit, sortBy, sortOrder, accessToken)
      .then((response) => {
        setClassifications(response.data.results);
        setPages(response.data.pages);
        setCount(response.data.count);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching classifications:", error);
        setError(error);
        setIsLoading(false);
      });
  }
  return {
    classifications,
    isLoading,
    error,
    pages,
    count,
    getClassifications,
  };
}
export default useAdmin;
