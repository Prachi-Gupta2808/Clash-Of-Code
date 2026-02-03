import { useAuth } from "@/auth/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";

const themes = [
  { key: "mcq", label: "MCQs", desc: "Quick coding questions" },
  { key: "predict", label: "Predict Output", desc: "Guess the output" },
  { key: "contest", label: "Contest", desc: "One full problem" },
];

const ThemeSelect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <div className="max-w-3xl w-full p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Choose a Battle Mode
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                console.log(user);
                navigate(`/lobby/${t.key}`) 
                }}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 text-left hover:scale-105 transition shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t.label}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelect;
