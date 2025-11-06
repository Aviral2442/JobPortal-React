import axios from "axios";

const api = axios.create({
  baseURL: "https://jobportal-react-one.onrender.com/api",
  withCredentials: true,
});

export default api;
