import { useAuth } from "@/auth/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";
import ExpandingPanelsHover from "../components/ExpandingPanelsHover"

const themes = [
  { key: "mcqs", label: "MCQs", desc: "Quick coding questions" },
  { key: "predict", label: "Predict Output", desc: "Guess the output" },
  { key: "contest", label: "Contest", desc: "One full problem" },
];

const ThemeSelect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen overflow-hidden">
      <ExpandingPanelsHover />
    </div>
  );
};

export default ThemeSelect;
