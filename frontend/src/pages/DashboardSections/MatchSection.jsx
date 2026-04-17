"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useEffect, useState } from "react";
import { getRecentMatches } from "../../api/auth";

const themeLabels = {
  contest: "Code Knockout",
  predict: "Output Rush",
  mcq: "Complexity Clash",
};

const MatchSection = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getRecentMatches();
        setMatches(res.data);
      } catch (err) {
        console.error("Failed to fetch matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-300 mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">
        Recent Matches
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.length === 0 ? (
          <p className="text-neutral-400 col-span-full text-center">
            No recent matches found
          </p>
        ) : (
          matches.map((match, index) => (
            <CardContainer key={index} className="w-full">
              <CardBody className="bg-gray-50 dark:bg-black border border-black/10 dark:border-white/[0.15] rounded-xl p-6 w-full h-full">
                <CardItem translateZ={80} className="mt-6">
                  <div className="flex justify-center relative w-24 h-12">
                    <img
                      src={match.you.avatar}
                      alt={match.you.username}
                      className="w-14 h-14 rounded-full object-cover absolute left-0 shadow-lg"
                    />
                    <img
                      src={match.opponent.avatar}
                      alt={match.opponent.username}
                      className="w-14 h-14 rounded-full object-cover absolute left-8 shadow-lg"
                    />
                  </div>
                </CardItem>

                <div className="text-center text-neutral-600 dark:text-white mt-6">
                  <span className="font-semibold text-orange-500">
                    {match.you.username}
                  </span>{" "}
                  vs{" "}
                  <span className="font-semibold text-orange-500">
                    {match.opponent.username}
                  </span>
                </div>

                <div className="text-center mt-2 text-sm text-neutral-500 dark:text-neutral-300">
                  Theme:{" "}
                  <span className="font-semibold text-orange-500">
                    {themeLabels[match.theme] || match.theme}
                  </span>
                </div>

                <div className="text-center mt-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      match.isTie
                        ? "bg-blue-900/20 text-blue-400 border border-blue-900/40"
                        : match.isWinner
                        ? "bg-green-900/20 text-green-400 border border-green-900/40"
                        : "bg-red-900/20 text-red-400 border border-red-900/40"
                    }`}
                  >
                    {match.isTie ? "Draw" : match.isWinner ? "Victory" : "Defeat"}
                  </span>
                </div>

                <div className="flex justify-center mt-6">
                  <CardItem
                    translateZ={30}
                    as="button"
                    onClick={() =>
                      (window.location.href = `/analytics/${match.matchId}`)
                    }
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-(--c4) text-white hover:bg-(--c3) transition cursor-pointer"
                  >
                    View Analytics
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

export default MatchSection;