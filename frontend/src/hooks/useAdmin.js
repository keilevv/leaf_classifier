import { useState, useEffect } from "react";
import useStore from "./useStore";
import adminService from "../Services/admin";

function useAdmin() {
  const { accessToken } = useStore();
  const [classifications, setClassifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [classificationsCount, setClassificationsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(1);
  const [users, setUsers] = useState([]);

  function getClassifications(page, limit, sortBy, sortOrder) {
    setIsLoading(true);
    return adminService
      .getAdminclassifications(page, limit, sortBy, sortOrder, accessToken)
      .then((response) => {
        setClassifications(response.data.results);
        setPages(response.data.pages);
        setClassificationsCount(response.data.count);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching classifications:", error);
        setError(error);
        setIsLoading(false);
      });
  }
  function getUsers(page, limit, sortBy, sortOrder) {
    setIsLoading(true);
    return adminService
      .getAdminUsers(page, limit, sortBy, sortOrder, accessToken)
      .then((response) => {
        setUsers(response.data.results);
        setPages(response.data.pages);
        setUsersCount(response.data.count);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError(error);
        setIsLoading(false);
      });
  }

  return {
    classifications,
    isLoading,
    error,
    pages,
    classificationsCount,
    getClassifications,
    users,
    getUsers,
    usersCount,
  };
}
export default useAdmin;
