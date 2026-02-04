import { useAuth } from "@/auth/AuthContext";
import { socket } from "@/components/socket/socket";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const Lobby = () => {
  const { mode } = useParams();
  const [status, setStatus] = useState("WAITING");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user || loading) return;

    console.log("Joining lobby as:", user._id);

    socket.emit("PLAY_NOW", { mode });

    socket.on("PAIRED" , (data) => {
      console.log("Paired:", data);
      setStatus("PAIRED");
    })

    return () => {
      socket.off("PAIRED");
    };
  }, [mode , loading , user ]);

  return (
    <div className="w-full h-screen flex justify-center items-center text-white">
      <h1>
        {status === "WAITING"
          ? "Waiting for opponent..."
          : "Match Found!"}
      </h1>
    </div>
  );
};

export default Lobby;
