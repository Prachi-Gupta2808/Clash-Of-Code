import { getInformation, submitOutput } from "@/api/auth";
import { useAuth } from "@/auth/AuthContext";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  HelpCircle,
  Loader2,
  RotateCcw,
  Terminal,
  Trophy,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AfterMatch from "../AfterMatch";

const Predict = () => {
  const { user, loading } = useAuth();
  const { matchId } = useParams();
  const socket = useRef(null);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [answerTimestamps, setAnswerTimestamps] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
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
      console.log("Connected ✅");
    });

    socket.current.emit("JOIN_ROOM", matchId);

    socket.current.on("MATCH_RESULT", (data) => {
      const myScore = data.scores.find((s) => s.userId === user._id)?.score ?? 0;

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

        if (matchInfo && matchInfo.data.questions.length > 0) {
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

  const normalize = (str) => {
    if (!str) return "";
    return str.trim().replace(/\s+/g, " ");
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    const timestamp = new Date().toISOString();

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: val,
    }));

    setAnswerTimestamps((prev) => ({
      ...prev,
      [currentIndex]: timestamp,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmitTest = async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);

    const payload = questions.map((q, index) => userAnswers[index] || "");
    const submissionTimes = questions.map((q, index) => answerTimestamps[index] || null);

    try {
      await submitOutput({
        finalAnswers: payload,
        submissionTimes,
        matchId,
      });
      setWaiting(true);
    } catch (err) {
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-screen bg-[#0f0f0f] items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span>Loading Challenge...</span>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex w-full h-screen bg-[#0f0f0f] text-gray-300 font-sans items-center justify-center">
        <div className="bg-[#18181b] p-12 rounded-2xl border border-[#27272a] text-center shadow-2xl max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-(--c4) blur-[100px] opacity-20 pointer-events-none"></div>

          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 drop-shadow-lg" />

          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Test Completed
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            You have successfully submitted your answers.
          </p>

          <div className="bg-[#0f0f0f] rounded-xl p-6 mb-8 border border-[#27272a]">
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
            <RotateCcw className="w-5 h-5" /> Go to Analytics
          </button>
        </div>
      </div>
    );
  }

  if (waiting) {
    return (
      <AfterMatch matchId={matchId} />
    );
  }

  return (
    <div className="flex w-full h-screen bg-[#0f0f0f] text-gray-300 font-sans overflow-hidden">
      <div className="w-1/2 h-full flex flex-col border-r border-[#27272a] bg-[#18181b]">
        <div className="h-16 border-b border-[#27272a] flex flex-col justify-center px-6 bg-[#18181b]">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-semibold text-white tracking-wide flex items-center gap-2">
              <Code2 className="w-4 h-4 text-(--c4)" />
              Source Code
            </h2>
            <span className="text-xs text-gray-500 font-mono">
              Q{currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full h-1 bg-[#27272a] rounded-full overflow-hidden">
            <div
              className="h-full bg-(--c4) transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            width="100%"
            language="cpp"
            value={currentQuestion?.statement || "// No code provided"}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 16,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 24, bottom: 24 },
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              renderLineHighlight: "all",
              smoothScrolling: true,
              domReadOnly: true,
            }}
          />
        </div>
      </div>

      <div className="w-1/2 h-full flex flex-col bg-[#0f0f0f]">
        <div className="h-16 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <Terminal className="w-5 h-5 text-blue-400" />
            <span className="uppercase tracking-wider font-semibold text-white">
              Your Prediction
            </span>
          </div>
          <div
            className={`text-xs px-2 py-1 rounded border ${
              userAnswers[currentIndex]
                ? "text-green-400 border-green-900 bg-green-900/10"
                : "text-gray-500 border-[#3f3f46] bg-[#27272a]"
            }`}
          >
            {userAnswers[currentIndex] ? "Answer Saved" : "Pending..."}
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {currentQuestion?.title || "Predict the Output"}
            </h3>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Analyze the code on the left. What will be printed to the console?
            </p>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-linear-to-b from-(--c4)/5 to-transparent opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity rounded-xl" />
            <textarea
              className="w-full h-full bg-[#18181b] text-white font-mono p-5 rounded-xl resize-none outline-none border-2 border-[#27272a] focus:border-(--c4) transition-all duration-200 shadow-inner placeholder:text-gray-600"
              placeholder="Type the exact output here..."
              value={userAnswers[currentIndex] || ""}
              onChange={handleInputChange}
              spellCheck="false"
            />
          </div>

          <div className="h-16 flex items-center gap-4 border-t border-[#27272a] pt-6">
            {isLastQuestion ? (
              <button
                onClick={handleSubmitTest}
                className="h-12 w-full px-8 rounded-lg text-sm font-bold uppercase tracking-wide bg-(--c4) hover:bg-(--c3) text-white shadow-lg shadow-(--c4)/20 active:scale-[0.98] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                Submit Test <CheckCircle2 className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="h-12 w-full px-8 rounded-lg text-sm font-bold uppercase tracking-wide bg-white text-black hover:bg-gray-200 shadow-lg active:scale-[0.98] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;