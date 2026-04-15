"use client";

import {
  acceptFriendRequest,
  cancelPendingRequest,
  getIncomingFriendRequests,
  getPendingFriendRequests,
  rejectFriendRequest,
} from "@/api/auth";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useEffect, useState } from "react";
import peopleSearchSvg from "/people_search.svg";

const NotificationSection = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const [incomingRes, pendingRes] = await Promise.all([
          getIncomingFriendRequests(),
          getPendingFriendRequests(),
        ]);

        const incoming = (incomingRes?.data?.incomingReqs || []).map((r) => ({
          ...r,
          type: "incoming",
          user: r.fromUser,
        }));

        const pending = (pendingRes?.data || []).map((r) => ({
          ...r,
          type: "pending",
          user: r.toUser,
        }));

        setRequests([...incoming, ...pending]);
      } catch (err) {
        console.error("Failed to fetch friend requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptFriendRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Accept failed", err);
    }
  };

  const handleRejectOrCancel = async (req) => {
    try {
      if (req.type === "incoming") {
        await rejectFriendRequest(req._id);
      } else {
        await cancelPendingRequest(req._id);
      }
      setRequests((prev) => prev.filter((r) => r._id !== req._id));
    } catch (err) {
      console.error("Action failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-300 mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <img src={peopleSearchSvg} alt="No requests" className="w-100 h-100 opacity-50" />
            <p className="text-neutral-400 text-center">
              No friend requests
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <CardContainer
              key={req._id}
              className="inter-var w-full cursor-pointer"
            >
              <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/20 border-black/10 rounded-xl p-6 border w-full h-full">
                <CardItem
                  translateZ={50}
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {req.type === "incoming"
                    ? req.user.fullName
                    : req.toUser.fullName}
                </CardItem>

                <CardItem
                  as="p"
                  translateZ={60}
                  className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                >
                  {req.type === "incoming"
                    ? "sent you a friend request"
                    : "Friend request pending"}
                </CardItem>

                <CardItem translateZ={100} className="w-full mt-4">
                  <img
                    src={req.user.avatar}
                    alt={req.user.username}
                    className="h-56 w-full object-cover object-center rounded-xl group-hover/card:shadow-xl"
                  />
                </CardItem>

                <div className="flex justify-center mt-6 gap-2">
                  {req.type === "incoming" && (
                    <CardItem
                      translateZ={20}
                      as="button"
                      onClick={() => handleAccept(req._id)}
                      className="bg-(--c4) hover:bg-(--c3) duration-300 text-white px-4 py-2 text-sm rounded-xl flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(242,97,63,0.6)]"
                    >
                      Accept
                    </CardItem>
                  )}

                  <CardItem
                    translateZ={20}
                    as="button"
                    onClick={() => handleRejectOrCancel(req)}
                    className="bg-red-600 hover:bg-red-700 duration-300 text-white px-4 py-2 text-sm rounded-xl flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(242,97,63,0.6)]"
                  >
                    {req.type === "incoming" ? "Reject" : "Cancel"}
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationSection;