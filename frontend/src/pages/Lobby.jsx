import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client"

const socket = io("http://localhost:3000") ;

const Lobby = () => {
  const { mode } = useParams() ;
  const [status , setStatus] = useState("WAITING") ;

  useEffect(() => {
    socket.emit("PLAY_NOW" , { mode }) ;
  
  }, [])
  

  return (
    <div className="w-full h-screen flex justify-center items-center text-white">
      
    </div>
  );
};

export default Lobby;
