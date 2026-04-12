import { AnimatePresence, motion } from "framer-motion";
import { Check, Swords, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../components/socket/socket";

const themeLabels = {
  contest: "Code Knockout",
  predict: "Output Rush",
  mcq: "Complexity Clash",
};

const themeColors = {
  contest: "text-blue-400",
  predict: "text-yellow-400",
  mcq: "text-purple-400",
};

export default function ChallengeNotification() {
  const [incoming, setIncoming] = useState(null);
  const [sentStatus, setSentStatus] = useState(null);
  const [isChallenge, setIsChallenge] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("INCOMING_CHALLENGE", (data) => {
      setIncoming(data);
    });

    socket.on("CHALLENGE_SENT", () => {
      setIsChallenge(true);
      setSentStatus("sent");
      setTimeout(() => setSentStatus(null), 3000);
    });

    socket.on("CHALLENGE_DECLINED", ({ message }) => {
      setIsChallenge(false);
      setSentStatus("declined");
      setTimeout(() => setSentStatus(null), 3000);
    });

    socket.on("CHALLENGE_PAIRED", ({ roomId, mode }) => {
      setIncoming(null);
      setSentStatus(null);
      setIsChallenge(false);
      navigate(`/match/${mode}/${roomId}`);
    });

    return () => {
      socket.off("INCOMING_CHALLENGE");
      socket.off("CHALLENGE_SENT");
      socket.off("CHALLENGE_DECLINED");
      socket.off("CHALLENGE_PAIRED");
    };
  }, []);

  const handleAccept = () => {
    socket.emit("CHALLENGE_ACCEPTED", {
      fromUserId: incoming.fromUserId,
      theme: incoming.theme,
    });
    setIncoming(null);
  };

  const handleDecline = () => {
    socket.emit("CHALLENGE_DECLINED", {
      fromUserId: incoming.fromUserId,
    });
    setIncoming(null);
  };

  return (
    <>
      <AnimatePresence>
        {incoming && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 right-6 z-[9999] w-80 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center">
                <Swords className="w-5 h-5 text-(--c4)" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Challenge Received!
                </p>
                <p className="text-neutral-400 text-xs">
                  from{" "}
                  <span className="text-white font-medium">
                    {incoming.fromUsername}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl px-4 py-3 flex items-center justify-between border border-white/5">
              <span className="text-xs text-neutral-500 uppercase tracking-widest">
                Mode
              </span>
              <span
                className={`text-sm font-bold ${themeColors[incoming.theme]}`}
              >
                {themeLabels[incoming.theme]}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 flex items-center justify-center gap-2 bg-(--c4) hover:opacity-90 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Accept
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 flex items-center justify-center gap-2 bg-[#27272a] hover:bg-red-600/80 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" /> Decline
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sentStatus && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl border ${
              sentStatus === "sent"
                ? "bg-[#18181b] border-white/10 text-white"
                : "bg-red-900/40 border-red-500/30 text-red-400"
            }`}
          >
            {sentStatus === "sent"
              ? "⚔️ Challenge sent! Waiting for response..."
              : "❌ Your challenge was declined."}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
