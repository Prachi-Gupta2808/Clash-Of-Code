import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const googleAuth = (credential) => API.post("/auth/google", { credential });
export const getMe = () => API.get("/auth/me");
export const logout = () => API.post("/auth/logout");
