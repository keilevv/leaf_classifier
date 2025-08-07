import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

axios.defaults.withCredentials = true;
const plantClassifierService = {
  uploadImage(formData) {
    return axios.post(`${apiUrl}/plant-classifier/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
export default plantClassifierService;
