import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

axios.defaults.withCredentials = true;
const plantClassifierService = {
  uploadImage(formData) {
    return axios.post(`${apiUrl}/plant-classifier/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getClassifications(page, limit, sortBy, sortOrder, accessToken) {
    return axios.get(`${apiUrl}/plant-classifier/classifications`, {
      params: { page, limit, sortBy, sortOrder },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  updateClassification(id, data, accessToken) {
    return axios.patch(
      `${apiUrl}/plant-classifier/classifications/${id}`,
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  },
};
export default plantClassifierService;
