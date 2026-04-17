import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// AUTH
export const signup = (data) => API.post("/api/auth/signup", data);
export const login = (data) => API.post("/api/auth/login", data);
export const googleAuth = (credential) =>
  API.post("/api/auth/google", { token: credential });
export const getMe = () => API.get("/api/auth/me");
export const logout = () => API.post("/api/auth/logout");

// DASHBOARD / FRIENDS
export const getFriends = () => API.get("/api/dashboard/friends");

export const sendFriendRequest = (userId) =>
  API.post(`/api/dashboard/friends/request/${userId}`);

export const getIncomingFriendRequests = () =>
  API.get("/api/dashboard/friends/requests/incoming");

export const getPendingFriendRequests = () =>
  API.get("/api/dashboard/friends/requests/pending");

export const acceptFriendRequest = (requestId) =>
  API.post(`/api/dashboard/friends/requests/${requestId}/accept`);

export const rejectFriendRequest = (requestId) =>
  API.delete(`/api/dashboard/friends/requests/${requestId}/reject`);

export const cancelPendingRequest = (requestId) =>
  API.delete(`/api/dashboard/friends/requests/${requestId}/cancel`);

export const removeFriend = (friendId) =>
  API.delete(`/api/dashboard/friends/${friendId}`);

export const searchUsers = (query) =>
  API.get(`/api/dashboard/search?q=${query}`);

export const getDashboardData = () => API.get("/api/dashboard/get-data");

// UPLOAD
export const uploadAvatar = (formData) =>
  API.post("/api/upload/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ADMIN
export const addQuestion = (data) => API.post("/api/admin/add", data);

// MATCH
export const getInformation = (data) =>
  API.post("/api/match/getinfo", { matchId: data });

export const getAnalytics = (data) =>
  API.post(`/api/match/getanalytics/${data}`);

export const getRecentMatches = () => API.get("/api/match/recent");

export const getMatchDuration = (matchId) =>
  API.get(`/api/match/get-duration/${matchId}`);

// SUBMIT
export const submitCode = (data) => API.post("/api/submit/contest", data);

export const submitOutput = (data) => API.post("/api/submit/predict", data);

export const submitMcq = (data) => API.post("/api/submit/mcq", data);

// RUN CODE

export const runCode = (data) => API.post("/api/submit/run", data) ;