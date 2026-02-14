import { useAuth } from "@/auth/AuthContext";
import { socket } from "@/components/socket/socket";
import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const { mode } = useParams();
  const [status, setStatus] = useState("WAITING");
  const { user, loading } = useAuth();
  const navigate = useNavigate() ;

  useEffect(() => {
    if (!user || loading) return;

    console.log("Joining lobby as:", user._id);

    socket.emit("PLAY_NOW", { mode });

    socket.on("PAIRED", (data) => {
      console.log("Paired:", data);
      navigate(`/match/${mode}/${data.roomId}`) ;
      setStatus("PAIRED");
    });


    return () => {
      socket.off("PAIRED");
    };
  }, [mode, loading, user]);

  return (
    <div className="w-full h-screen flex justify-center items-center text-white">
      <h1>
        {status === "WAITING" ? "Waiting for opponent..." : status}
      </h1>
    </div>
  );
};

export default Lobby;
