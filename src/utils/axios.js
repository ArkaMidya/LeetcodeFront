import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://leetcodebackend-ghpo.onrender.com";

const axiosMain = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosMain;