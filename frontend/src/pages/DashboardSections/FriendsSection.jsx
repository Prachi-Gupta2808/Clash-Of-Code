"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getFriends,
  removeFriend,
  searchUsers,
  sendFriendRequest,
} from "../../api/auth";

const FriendsSection = () => {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await getFriends();
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, []);

  // Search users
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchUsers(search);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);

      // ✅ hide immediately
      setPendingSent((prev) => [...prev, userId]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove friend");
    }
  };

  const displayList = search.trim()
    ? searchResults.filter(
        (u) =>
          !friends.some((f) => f._id === u._id) && !pendingSent.includes(u._id)
      )
    : friends;

  return (
    <div className="w-full max-w-300 mx-auto px-4 py-12 flex flex-col items-center gap-6">
      {/* Search Bar */}
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search Users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 pr-12 rounded-2xl bg-black/60 backdrop-blur border border-white/10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-(--c4)"
          />
          <Search
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
          />
        </div>

        <p className="mt-4 text-xl text-neutral-400">
          {search.trim()
            ? "Search users to send requests"
            : "Your friends, challenge them!"}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {loading ? (
          <p className="text-white text-center col-span-full">Loading...</p>
        ) : displayList.length === 0 ? (
          search.trim() && (
            <p className="text-white text-center col-span-full">
              No users found.
            </p>
          )
        ) : (
          displayList.map((user) => (
            <CardContainer
              key={user._id}
              className="inter-var w-full cursor-pointer"
            >
              <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/20 border-black/10 rounded-xl p-6 border w-full h-full">
                <CardItem translateZ={50} className="text-xl font-bold text-white">
                  {(user.username) ? (user.username) : "DefaultUser"}
                </CardItem>

                <CardItem as="p" translateZ={60} className="text-sm mt-2 text-white">
                  {user.fullName}
                </CardItem>

                <CardItem translateZ={100} className="w-full mt-4">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-56 w-full object-cover rounded-xl"
                  />
                </CardItem>

                <div className="flex justify-center mt-6 gap-2">
                  {search.trim() ? (
                    <CardItem
                      translateZ={20}
                      as="button"
                      onClick={() => handleSendRequest(user._id)}
                      className="bg-(--c4) text-white px-4 py-2 rounded-xl"
                    >
                      Send Friend Request
                    </CardItem>
                  ) : (
                    <>
                      <CardItem
                        translateZ={20}
                        as="button"
                        className="bg-(--c4) text-white px-4 py-2 rounded-xl"
                      >
                        Challenge Now
                      </CardItem>
                      <CardItem
                        translateZ={20}
                        as="button"
                        onClick={() => handleRemoveFriend(user._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Remove Friend
                      </CardItem>
                    </>
                  )}
                </div>
              </CardBody>
            </CardContainer>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsSection;
