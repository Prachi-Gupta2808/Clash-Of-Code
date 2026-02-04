import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const googleAuth = (credential) => API.post("/auth/google", { token : credential });
export const getMe = () => API.get("/auth/me");
export const logout = () => API.post("/auth/logout");

export const getFriends = () => API.get("/dashboard/friends");

export const sendFriendRequest = (userId) =>
  API.post(`/dashboard/friends/request/${userId}`);

export const getIncomingFriendRequests = () =>
  API.get("/dashboard/friends/requests/incoming");

export const getPendingFriendRequests = () =>
  API.get("/dashboard/friends/requests/pending");

export const acceptFriendRequest = (requestId) =>
  API.post(`/dashboard/friends/requests/${requestId}/accept`);

export const rejectFriendRequest = (requestId) =>
  API.delete(`/dashboard/friends/requests/${requestId}/reject`);

export const removeFriend = (friendId) =>
  API.delete(`/dashboard/friends/${friendId}`);

export const searchUsers = (query) => API.get(`/dashboard/search?q=${query}`);
// api/auth.js

export const cancelPendingRequest = (requestId) =>
  API.delete(`/dashboard/friends/requests/${requestId}/cancel`);
