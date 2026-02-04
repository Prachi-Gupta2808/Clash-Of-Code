const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

/* ================= FRIEND REQUESTS ================= */

router.get(
  "/friends",
  protect,
  dashboardController.getFriends
)

// Send friend request
router.post(
  "/friends/request/:id",
  protect,
  dashboardController.sendFriendRequest 
);

// Get incoming friend requests
router.get(
  "/friends/requests/incoming",
  protect,
  dashboardController.getFriendRequests
);

// Get pending (outgoing) friend requests
router.get(
  "/friends/requests/pending",
  protect,
  dashboardController.getPendingFriendReqs
);

// Accept friend request
router.post(
  "/friends/requests/:id/accept",
  protect,
  dashboardController.acceptFriendRequest
);

// Reject friend request
router.delete(
  "/friends/requests/:id/reject",
  protect,
  dashboardController.rejectFriendRequest
);

// Search users globally
router.get("/search", protect, dashboardController.searchUsers);
// Remove friend
router.delete("/friends/:id", protect, dashboardController.removeFriend);

// routes/dashboardRoutes.js

router.delete(
  "/friends/requests/:id/cancel",
  protect,
  dashboardController.cancelPendingRequest
);

module.exports = router;
