import { getInformation, submitMcq } from "@/api/auth";
import { useAuth } from "@/auth/AuthContext";
import { Clock, HelpCircle, LayoutGrid, Loader2, Trophy } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AfterMatch from "../AfterMatch";

const Mcq = () => {
  const { user, loading } = useAuth();
  const { matchId } = useParams();
  const navigate = useNavigate();
  const socket = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [answerTimestamps, setAnswerTimestamps] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [endTime, setEndTime] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !matchId) return;

    if (!socket.current) {
      socket.current = io("http://localhost:5000", {
        transports: ["polling", "websocket"],
        withCredentials: true,
      });
    }

    socket.current.on("connect", () => {
      console.log("Connected");
    });

    socket.current.emit("JOIN_ROOM", matchId);

    socket.current.on("MATCH_RESULT", (data) => {
      const myScore =
        data.scores.find((s) => s.userId === user._id)?.score ?? 0;
      setFinalScore(myScore);
      setIsSubmitted(true);
      setWaiting(false);
    });

    socket.current.on("USER_SUBMITTED", ({ userId }) => {
      if (userId !== user._id) {
        console.log("Opponent submitted");
      }
    });

    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [user, matchId]);

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const remaining = Math.floor((new Date(endTime) - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);
        handleSubmitTest();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    if (!user || loading || !matchId) return;

    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const matchInfo = await getInformation(matchId);
        setEndTime(matchInfo.data.endTime);

        if (matchInfo?.data?.questions?.length > 0) {
          setQuestions(matchInfo.data.questions);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [user, loading, matchId]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSubmitTest = async (
    answers = userAnswers,
    timestamps = answerTimestamps,
  ) => {
    if (submitting) return;

    setSubmitting(true);

    const finalAnswers = questions.map((_, index) => answers[index] || "");
    const submissionTimes = questions.map(
      (_, index) => timestamps[index] || null,
    );

    try {
      await submitMcq({
        finalAnswers,
        submissionTimes,
        matchId,
      });

      setWaiting(true);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionSelect = (option) => {
    const timestamp = new Date().toISOString();
    const updatedAnswers = {
      ...userAnswers,
      [currentIndex]: option,
    };

    const updatedTimestamps = {
      ...answerTimestamps,
      [currentIndex]: timestamp,
    };

    setUserAnswers(updatedAnswers);
    setAnswerTimestamps(updatedTimestamps);

    if (isLastQuestion) {
      handleSubmitTest(updatedAnswers, updatedTimestamps);
    } else {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-screen bg-[#0f0f0f] items-center justify-center text-gray-400 font-sans">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-(--c4)" />
        <span className="text-sm font-medium tracking-wide">
          Loading Assessment...
        </span>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex w-full h-screen bg-[#0f0f0f] text-gray-300 font-sans items-center justify-center">
        <div className="bg-[#18181b] p-12 rounded-2xl border border-[#27272a] text-center max-w-lg w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-(--c4) blur-[100px] opacity-20 pointer-events-none"></div>

          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 drop-shadow-lg" />
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Completed</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Your answers have been recorded.
          </p>

          <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#27272a]">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-2">
              Final Score
            </p>
            <div className="text-6xl font-mono font-bold text-white">
              {finalScore}{" "}
              <span className="text-3xl text-gray-600">
                / {questions.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/analytics/${matchId}`)}
            className="w-full py-4 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Go to Analytics
          </button>
        </div>
      </div>
    );
  }

  if (waiting) {
    return <AfterMatch />;
  }

  return (
    <div className="flex w-full h-screen bg-[#0f0f0f] text-gray-300 font-sans overflow-hidden">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #18181b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #52525b; }
      `}</style>

      <div className="w-[55%] h-full flex flex-col border-r border-[#27272a] bg-[#18181b]">
        <div className="h-14 border-b border-[#27272a] flex items-center justify-between px-6 bg-[#18181b]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-(--c4)" />
            <h2 className="font-semibold text-white tracking-wide text-sm">
              Question {currentIndex + 1}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {timeLeft > 0
                ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "MCQ Mode"}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-4">
                {currentQuestion?.statement || "Loading..."}
              </h1>
              {currentQuestion?.tags && (
                <div className="flex gap-2">
                  {currentQuestion.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#27272a] text-gray-400 border border-[#3f3f46] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px w-full bg-[#27272a] mb-6"></div>

            <div className="flex flex-col gap-3">
              {currentQuestion?.options &&
              currentQuestion.options.length > 0 ? (
                currentQuestion.options.map((option, idx) => {
                  const isSelected = userAnswers[currentIndex] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className={`
                        w-full text-left p-4 rounded-lg border transition-all duration-150 flex items-center gap-4 relative overflow-hidden group
                        ${
                          isSelected
                            ? "bg-(--c4) border-(--c4) text-white"
                            : "bg-[#0f0f0f] border-[#27272a] hover:bg-[#27272a] hover:border-gray-600 text-gray-300"
                        }
                      `}
                    >
                      <div
                        className={`
                          w-6 h-6 rounded flex items-center justify-center text-xs font-bold border transition-colors
                          ${
                            isSelected
                              ? "bg-white text-black border-white"
                              : "bg-[#18181b] text-gray-500 border-[#3f3f46] group-hover:border-gray-500"
                          }
                        `}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-base font-medium">{option}</span>
                    </button>
                  );
                })
              ) : (
                <div className="text-gray-500 italic p-4 text-center">
                  No options available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[45%] h-full flex flex-col bg-[#0f0f0f]">
        <div className="h-14 border-b border-[#27272a] bg-[#18181b] flex items-center px-6">
          <div className="flex items-center gap-2 text-gray-300">
            <LayoutGrid className="w-4 h-4 text-gray-500" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Progress
            </span>
          </div>
        </div>

        <div className="p-6 pb-2">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-4 bg-[#18181b] p-3 rounded-lg border border-[#27272a]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div> Current
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> Answered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3f3f46]"></div> Unseen
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <div className="grid grid-cols-10 gap-2 content-start">
            {questions.map((_, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = userAnswers[idx] !== undefined;

              return (
                <div
                  key={idx}
                  className={`
                    aspect-square rounded-md flex items-center justify-center font-bold text-xs transition-all select-none cursor-default
                    ${
                      isCurrent
                        ? "bg-orange-500 text-white ring-1 ring-[#0f0f0f] scale-110 z-10"
                        : isAnswered
                          ? "bg-green-600 text-white opacity-50"
                          : "bg-[#18181b] border border-[#27272a] text-gray-600"
                    }
                  `}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-[#27272a] bg-[#18181b] text-center text-[10px] text-gray-600 uppercase tracking-widest">
          Auto-Save Enabled
        </div>
      </div>
    </div>
  );
};

export default Mcq;
