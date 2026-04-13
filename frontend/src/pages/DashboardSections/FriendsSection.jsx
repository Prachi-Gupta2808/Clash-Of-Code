"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getFriends,
  removeFriend,
  searchUsers,
  sendFriendRequest,
} from "../../api/auth";
import { socket } from "../../components/socket/socket";

const panelsData = [
  {
    id: 1,
    key: "contest",
    title: "Code Knockout",
    image: "/codeknockout.png",
    description: "Compete 1v1 in real-time coding battles.",
  },
  {
    id: 2,
    key: "predict",
    title: "Output Rush",
    image: "/predictoutput.png",
    description: "Predict outputs of tricky code snippets.",
  },
  {
    id: 3,
    key: "mcq",
    title: "Complexity Clash",
    image: "/timecomplexity.png",
    description: "Analyze algorithms and choose the correct complexity.",
  },
];

function Panel({ panel, isActive, onHover, onClick }) {
  return (
    <motion.div
      onHoverStart={onHover}
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl shrink-0"
      animate={{ width: isActive ? "55%" : "22%" }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={panel.image}
        alt={panel.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ scale: isActive ? 1.08 : 1 }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute bottom-6 left-6 right-4 text-white">
        <h2 className="text-xl font-bold tracking-wide">{panel.title}</h2>
        {isActive && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-2 text-xs text-gray-300 leading-relaxed"
          >
            {panel.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function ThemePickerModal({ friend, onClose, onThemeSelect }) {
  const [activeId, setActiveId] = useState(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col gap-5 p-7 rounded-3xl bg-[#0f0f0f] border border-white/10 w-[88vw] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Challenge{" "}
            <span style={{ color: "var(--c4)" }}>{friend.username}</span>
          </h2>
          <p className="text-neutral-400 mt-1 text-sm">
            Pick a mode to challenge in
          </p>
        </div>

        <div className="flex h-[50vh] w-full gap-4">
          {panelsData.map((panel) => (
            <Panel
              key={panel.id}
              panel={panel}
              isActive={panel.id === activeId}
              onHover={() => setActiveId(panel.id)}
              onClick={() => onThemeSelect(panel.key)}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

const FriendsSection = () => {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [challengingFriend, setChallengingFriend] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await getFriends();
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchFriends();
  }, []);

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

  const handleThemeSelect = (theme) => {
    if (!challengingFriend) return;

    socket.connect();

    socket.emit("CHALLENGE_REQUEST", {
      toUserId: challengingFriend._id,
      theme,
    });

    setChallengingFriend(null);
  };

  const displayList = search.trim()
    ? searchResults.filter(
        (u) =>
          !friends.some((f) => f._id === u._id) && !pendingSent.includes(u._id)
      )
    : friends;

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {challengingFriend && (
          <ThemePickerModal
            friend={challengingFriend}
            onClose={() => setChallengingFriend(null)}
            onThemeSelect={handleThemeSelect}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-300 mx-auto px-4 py-12 flex flex-col items-center gap-6">
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
                  <CardItem
                    translateZ={50}
                    className="text-xl font-bold text-white"
                  >
                    {user.username || "DefaultUser"}
                  </CardItem>

                  <CardItem
                    as="p"
                    translateZ={60}
                    className="text-sm mt-2 text-white"
                  >
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
                          onClick={() => setChallengingFriend(user)}
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
    </>
  );
};

export default FriendsSection;