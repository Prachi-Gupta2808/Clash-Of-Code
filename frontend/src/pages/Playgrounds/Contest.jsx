import { getInformation, submitCode } from "@/api/auth";
import { useAuth } from "@/auth/AuthContext";
import { socket } from "@/components/socket/socket";
import Editor from "@monaco-editor/react";
import {
  AlertCircle,
  Clock,
  Code2,
  Cpu,
  FileText,
  Hash,
  Loader2,
  Play,
  RotateCcw,
  Terminal,
  Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AfterMatch from "../AfterMatch";

const statusColors = {
  Compiling: "text-yellow-400",
  AC: "text-green-400",
  WA: "text-red-400",
  RE: "text-red-500",
  CE: "text-orange-400",
};

const Contest = () => {
  const { user, loading } = useAuth();
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [matchResult, setMatchResult] = useState(null);

  const latestEditorState = useRef({ code, language, question });

  useEffect(() => {
    latestEditorState.current = { code, language, question };
  }, [code, language, question]);

  useEffect(() => {
    if (!user || !matchId) return;

    socket.emit("JOIN_ROOM", matchId);

    socket.on("MATCH_RESULT", (data) => {
      const myResult = data.scores?.find((s) => s.userId === user._id);
      setMatchResult(myResult || data);
      setIsSubmitted(true);
      setWaiting(false);
    });

    socket.on("WINNER", (data) => {
      setMatchResult(data);
      setIsSubmitted(true);
      setWaiting(false);
    });

    return () => {
      socket.off("MATCH_RESULT");
      socket.off("WINNER");
    };
  }, [user, matchId]);

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const remaining = Math.floor((new Date(endTime) - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);
        const {
          language: currentLang,
          code: currentCode,
          question: currentQuestion,
        } = latestEditorState.current;
        handleTimeoutSubmit(currentLang, currentCode, currentQuestion);
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
          setQuestion(matchInfo.data.questions[0]);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [user, loading, matchId]);

  const handleTimeoutSubmit = async (
    currentLang,
    currentCode,
    currentQuestion
  ) => {
    if (isCompiling || waiting) return;
    setIsCompiling(true);
    try {
      await submitCode({
        language: currentLang,
        code: currentCode,
        questionId: currentQuestion?._id,
        matchId,
        submissionTimes: [new Date().toISOString()],
      });
      setWaiting(true);
    } catch (err) {
      setOutput("Auto-submission failed.");
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSubmit = async () => {
    setIsCompiling(true);
    setOutput("Compiling...");

    try {
      const response = await submitCode({
        language,
        code,
        questionId: question?._id,
        matchId,
        submissionTimes: [new Date().toISOString()],
      });
      const resp = response.data;

      setOutput(resp.verdict || resp.output || "Execution Complete");

      if (resp.verdict === "AC") {
        setWaiting(true);
      }
    } catch (err) {
      setOutput("Error connecting to compiler server.");
    } finally {
      setIsCompiling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-screen bg-[#0f0f0f] items-center justify-center text-gray-400 font-sans">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-(--c4)" />
        <span className="text-sm font-medium tracking-wide">
          Loading Challenge...
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
          <h1 className="text-4xl font-bold text-white mb-2">
            Match Completed
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            The coding contest has ended.
          </p>
          <div className="bg-[#0f0f0f] rounded-xl p-6 mb-8 border border-[#27272a]">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-2">
              Result
            </p>
            <div className="text-2xl font-mono font-bold text-white">
              {matchResult?.msg || matchResult?.verdict || "Completed"}
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
    return <AfterMatch matchId={matchId} />;
  }

  return (
    <div className="flex w-full h-screen bg-[#0f0f0f] text-gray-300 font-sans overflow-hidden">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #18181b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 4px; border: 2px solid #18181b; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #52525b; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #3f3f46 #18181b; }
      `}</style>

      <div className="w-[40%] h-full flex flex-col border-r border-[#27272a] bg-[#18181b]">
        <div className="h-14 border-b border-[#27272a] flex items-center justify-between px-6 bg-[#18181b]">
          <div className="flex items-center">
            <FileText className="w-4 h-4 text-(--c4) mr-2" />
            <h2 className="font-semibold text-white tracking-wide text-sm">
              Description
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {timeLeft > 0
                ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "00:00"}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {!question ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading
              Problem...
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-4">
                {question.title || `Problem ${matchId}`}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#27272a] text-xs text-gray-400 border border-[#3f3f46]">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>{question.timeLimit || 1.0}s</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#27272a] text-xs text-gray-400 border border-[#3f3f46]">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>{question.memoryLimit || 256}MB</span>
                </div>
              </div>
              <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none leading-relaxed text-sm">
                <p className="whitespace-pre-wrap">{question.statement}</p>
              </div>
              <div className="mt-8 space-y-6">
                {question.inputFormat && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                      <Terminal className="w-3 h-3 text-(--c4)" /> Input Format
                    </h3>
                    <p className="text-sm text-gray-400 bg-[#0f0f0f] p-3 rounded-md border border-[#27272a] whitespace-pre-wrap">
                      {question.inputFormat}
                    </p>
                  </div>
                )}
                {question.outputFormat && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                      <Terminal className="w-3 h-3 text-(--c4)" /> Output Format
                    </h3>
                    <p className="text-sm text-gray-400 bg-[#0f0f0f] p-3 rounded-md border border-[#27272a] whitespace-pre-wrap">
                      {question.outputFormat}
                    </p>
                  </div>
                )}
                {question.contraints && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                      <AlertCircle className="w-3 h-3 text-red-400" />{" "}
                      Constraints
                    </h3>
                    <div className="text-sm text-gray-400 bg-[#0f0f0f] p-3 rounded-md border border-[#27272a] font-mono whitespace-pre-wrap">
                      {question.contraints}
                    </div>
                  </div>
                )}
                {(question.preTest || question.preTestOutput) && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold mb-3 border-b border-[#27272a] pb-2 text-sm flex items-center gap-2">
                      <Hash className="w-3 h-3 text-blue-400" /> Sample Case
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1 uppercase font-semibold">
                          Input
                        </div>
                        <div className="bg-[#0f0f0f] p-3 rounded-md border border-[#27272a] font-mono text-sm text-gray-300 whitespace-pre overflow-x-auto custom-scrollbar">
                          {question.preTest || "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1 uppercase font-semibold">
                          Output
                        </div>
                        <div className="bg-[#0f0f0f] p-3 rounded-md border border-[#27272a] font-mono text-sm text-gray-300 whitespace-pre overflow-x-auto custom-scrollbar">
                          {question.preTestOutput || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-[60%] h-full flex flex-col relative">
        <div className="h-14 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 bg-[#27272a] px-3 py-1.5 rounded-md">
              <Code2 className="w-4 h-4" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent outline-none cursor-pointer border-none rounded-md"
              >
                <option value="cpp" className="bg-gray-900 text-gray-500">
                  C++
                </option>
                <option value="python" className="bg-gray-900 text-gray-500">
                  Python
                </option>
                <option value="java" className="bg-gray-900 text-gray-500">
                  Java
                </option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isCompiling}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-md text-sm font-semibold transition-all ${
              isCompiling
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-(--c4) hover:bg-(--c3) cursor-pointer text-white shadow-lg shadow-green-900/20 active:scale-95"
            }`}
          >
            {isCompiling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Running...
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" /> Submit
              </>
            )}
          </button>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            width="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            }}
          />
        </div>

        <div className="h-50 border-t border-[#27272a] bg-[#0f0f0f] flex flex-col">
          <div className="h-9 bg-[#18181b] border-b border-[#27272a] flex items-center px-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Terminal className="w-3 h-3" />
              <span>Submission Result</span>
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto custom-scrollbar">
            {output ? (
              <pre className={`${statusColors[output] || "text-gray-300"}`}>
                {output}
              </pre>
            ) : (
              <div className="text-gray-600 italic">
                Result will appear here after compilation...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;
