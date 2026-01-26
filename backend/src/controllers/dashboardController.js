const User = require("../models/User.model");
const FriendRequest = require("../models/FriendRequest.model");
const ChallengeRequest = require("../models/ChallengeRequest.model");
const ActiveDay = require("../models/ActiveDay.model");

// Get sare dosts

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friendList")
      .populate("friendList", "username fullName title rating");

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

// Get incoming and accepted requests

exports.getFriendRequests = async (req, res) => {
  try {
    const incomingReqs = await FriendRequest.find({
      toUser: req.user.id,
      status: "pending",
    }).populate("fromUser", "username fullName title rating");

    const acceptedReqs = await FriendRequest.find({
      fromUser: req.user.id,
      status: "accepted",
    }).populate("toUser", "fullName");

    res.status(200).json({ incomingReqs, acceptedReqs });
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
    }).populate("toUser", "username fullName title rating");

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

// Send Challenge Request

exports.sendChallengeRequest = async (req, res) => {
  try {
    const fromUser = req.user.id;
    const { id: toUser } = req.params;
    const { theme, expiresAt } = req.body;

    if (fromUser === toUser) {
      return res.status(400).json({ message: "You cannot challenge yourself" });
    }

    if (!theme || !expiresAt) {
      return res
        .status(400)
        .json({ message: "Theme and expiry time are required" });
    }

    const opponent = await User.findById(toUser);
    if (!opponent) {
      return res.status(404).json({ message: "User not found" });
    }

    // reverse pending challenges
    const existingChallenge = await ChallengeRequest.findOne({
      $or: [
        { fromUser, toUser, status: "pending" },
        { fromUser: toUser, toUser: fromUser, status: "pending" },
      ],
    });

    if (existingChallenge) {
      return res.status(400).json({
        message: "A pending challenge already exists between you two",
      });
    }

    const challenge = await ChallengeRequest.create({
      fromUser,
      toUser,
      theme,
      expiresAt,
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.log("Error in sendChallengeRequest", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Accept Challenge Request

exports.acceptChallengeRequest = async (req, res) => {
  try {
    const { id: challengeId } = req.params;

    const challenge = await ChallengeRequest.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge request not found" });
    }

    // only receiver can accept
    if (challenge.toUser.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this challenge" });
    }

    if (challenge.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This challenge is no longer pending" });
    }

    // check expiry
    if (new Date(challenge.expiresAt) < new Date()) {
      challenge.status = "rejected";
      await challenge.save();
      return res.status(400).json({ message: "Challenge has expired" });
    }

    challenge.status = "accepted";
    await challenge.save();

    // create match badhme hum krlenge

    res.status(200).json({
      message: "Challenge accepted",
      challenge,
    });
  } catch (error) {
    console.log("Error in acceptChallengeRequest", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reject Challenge Request

exports.rejectChallengeRequest = async (req, res) => {
  try {
    const { id: challengeId } = req.params;

    const challenge = await ChallengeRequest.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge request not found" });
    }

    // only receiver can reject
    if (challenge.toUser.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this challenge" });
    }

    if (challenge.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This challenge is no longer pending" });
    }

    challenge.status = "rejected";
    await challenge.save();

    res.status(200).json({ message: "Challenge rejected" });
  } catch (error) {
    console.log("Error in rejectChallengeRequest", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Challenge Request

exports.getChallengeRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeRequests = await ChallengeRequest.find({ toUser: userId });
    res.status(200).json(challengeRequests);
  } catch (error) {
    console.log("Error in getChallengeRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get active days (heatmap ke liye)

exports.updateActiveDays = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split("T")[0] ;

    const currentDayRecord = await ActiveDay.findOneAndUpdate(
      { userId, date },
      {
        $inc: { submissionCount: 1 },
        $setOnInsert: { userId, date },
      },
      { upsert: true , new: true },
    );
    res.status(201).send(currentDayRecord) ;
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
