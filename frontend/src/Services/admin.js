import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

axios.defaults.withCredentials = true;
const adminService = {
  getAdminclassifications(page, limit, sortBy, sortOrder, accessToken) {
    return axios.get(`${apiUrl}/admin/classifications`, {
      params: { page, limit, sortBy, sortOrder },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getAdminUsers(page, limit, sortBy, sortOrder, accessToken) {
    return axios.get(`${apiUrl}/admin/users`, {
      params: { page, limit, sortBy, sortOrder },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
export default adminService;
