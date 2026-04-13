const User = require("../models/User.model");
const FriendRequest = require("../models/FriendRequest.model");
const ChallengeRequest = require("../models/ChallengeRequest.model");
const ActiveDay = require("../models/ActiveDays.model");
const Match = require("../models/Match.model");
const { create } = require("../models/Question.model");
const Submission = require("../models/Submission.model");
const { getHeatmapData } = require("../utils/getHeatmapData");

// Get sare dosts
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friendList")
      .populate("friendList", "username fullName title rating avatar");

    res.status(200).json(user.friendList);
  } catch (error) {
    res.status(500).json({
      message: "Failed fetching friends, try again later!",
    });
  }
};

// Send friend request

exports.sendFriendRequest = async (req, res) => {
  try {
    const me = req.user.id;
    const { id: toUserId } = req.params;

    if (me === toUserId) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself!" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // already friends check
    if (toUser.friendList.includes(me)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    // existing request check
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { fromUser: me, toUser: toUserId },
        { fromUser: toUserId, toUser: me },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      fromUser: me,
      toUser: toUserId,
      status: "pending",
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({
      message: "Error sending friend request",
    });
  }
};

// Accept friend request

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // only receiver can accept
    if (friendRequest.toUser.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add both users to each other's friendList
    await User.findByIdAndUpdate(friendRequest.fromUser, {
      $addToSet: { friendList: friendRequest.toUser },
    });

    await User.findByIdAndUpdate(friendRequest.toUser, {
      $addToSet: { friendList: friendRequest.fromUser },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get incoming

exports.getFriendRequests = async (req, res) => {
  try {
    const incomingReqs = await FriendRequest.find({
      toUser: req.user.id,
      status: "pending",
    }).populate("fromUser", "username fullName title rating avatar");

    res.status(200).json({ incomingReqs });
  } catch (error) {
    console.log("Error in getFriendRequests", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get pending requests

exports.getPendingFriendReqs = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      fromUser: req.user.id,
      status: "pending",
    }).populate("toUser", "username fullName title rating avatar");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reject friend request

exports.rejectFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // only receiver can reject
    if (friendRequest.toUser.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this request" });
    }

    if (friendRequest.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request is no longer pending" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.log("Error in rejectFriendRequest", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// unfriend dost

exports.removeFriend = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const myId = req.user.id;

    if (myId === friendId) {
      return res.status(400).json({ message: "You cannot remove yourself" });
    }

    await User.findByIdAndUpdate(myId, {
      $pull: { friendList: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friendList: myId },
    });

    // remove accepted request record
    await FriendRequest.findOneAndDelete({
      $or: [
        { fromUser: myId, toUser: friendId, status: "accepted" },
        { fromUser: friendId, toUser: myId, status: "accepted" },
      ],
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.log("Error in removeFriend", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get active days (heatmap ke liye)

exports.updateActiveDays = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split("T")[0];

    const currentDayRecord = await ActiveDay.findOneAndUpdate(
      { userId, date },
      {
        $inc: { submissionCount: 1 },
        $setOnInsert: { userId, date },
      },
      { upsert: true, new: true }
    );
    res.status(201).send(currentDayRecord);
  } catch (error) {
    console.log("Error in updateActiveDays controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getActiveDays = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeDays = await ActiveDay.find({ userId })
      .select("date submissionCount -_id")
      .sort({ date: 1 });

    res.status(200).json(activeDays);
  } catch (error) {
    console.log("Error in getActiveDays controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search users globally

exports.searchUsers = async (req, res) => {
  try {
    const myId = req.user.id;
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const me = await User.findById(myId).select("friendList");

    const users = await User.find({
      _id: {
        $ne: myId,
        $nin: me.friendList,
      },
      $or: [
        { username: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
      ],
    })
      .select("username fullName title rating avatar")
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchUsers", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// controllers/dashboardController.js

exports.cancelPendingRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const myId = req.user.id;

    const request = await FriendRequest.findOne({
      _id: requestId,
      fromUser: myId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Pending request not found" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      message: "Friend request cancelled successfully",
    });
  } catch (error) {
    console.error("Error in cancelPendingRequest:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const ratingDeltas = [0];
    const startingRating = 800;
    const userRating = await User.findById(req.user._id).select("rating");
    const userSubmissionsCount = await Submission.find({ user: req.user._id }).countDocuments();
    const heatmapData = await getHeatmapData(req.user._id);

    // filling the ratingDeltas array
    const userMatches = await Match.find({ $or: [{ player1: req.user._id }, { player2: req.user._id }] }).populate("questions").sort({ createdAt: -1 });
    userMatches.forEach((match) => {
      ratingDeltas.push((match?.ratingChange?.p1?.id?.toString() === req.user._id.toString()) ? Math.floor(match.ratingChange.p1.delta) : Math.floor(match.ratingChange.p2.delta));
    })

    res.status(200).json({ ratingDeltas: ratingDeltas, rating: userRating.rating , startingRating: startingRating , userSubmissionCount : userSubmissionsCount , heatmapData : heatmapData }) ;
  } catch (error) {
    console.log("Error in getting dashboard data: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}