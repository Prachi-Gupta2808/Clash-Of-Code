import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useParams } from "react-router-dom";
import Contest from "./Playgrounds/Contest";
import Mcq from "./Playgrounds/Mcq";
import Predict from "./Playgrounds/Predict";

const Playground = () => {
  const { user, loading } = useAuth();
  const { theme , matchId } = useParams();

  return (
    <div>
      { (theme == "contest") ? < Contest /> : "" }
      { (theme == "mcq") ? < Mcq /> : "" }
      { (theme == "predict") ? < Predict /> : "" }
    </div>
  );
};

export default Playground;
