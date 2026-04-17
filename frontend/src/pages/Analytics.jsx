import { useAuth } from "@/auth/AuthContext";
import { getInformation, getAnalytics } from "@/api/auth";
import Editor from "@monaco-editor/react";
import {
  BarChart2,
  CheckCircle2,
  Clock,
  Target,
  Trophy,
  XCircle,
  Swords,
  Loader2,
  Code2,
  FileText,
  TerminalSquare,
  AlertCircle // Added for Draw state
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Helper function to format seconds into mm:ss min
const formatTime = (totalSeconds) => {
  if (isNaN(totalSeconds)) return "0:00 min";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")} min`;
};

const Analytics = () => {
  const { user } = useAuth();
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        getAnalytics(matchId).then((response) => {
          setAnalyticsData(response.data);
          setLoading(false);
        });
      } catch (error) {
        console.error("Failed to fetch analytics", error);
        setLoading(false);
      }
    };

    if (matchId) fetchAnalytics();
  }, [matchId, user]);

  if (loading || !analyticsData) {
    return (
      <div className="flex w-full h-screen bg-[#0f0f0f] items-center justify-center text-gray-400 font-sans">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-(--c4)" />
        <span className="text-sm font-medium tracking-wide">
          Analyzing Match Data...
        </span>
      </div>
    );
  }

  const {
    you,
    opponent,
    chartData,
    questionsBreakdown,
    matchType,
    yourCodeSubmission,
    opponentCodeSubmission,
    isTie // <-- EXTRACTED TIE FLAG
  } = analyticsData;

  const isWinner = analyticsData.winnerId === you.id;
  const isContest = matchType === "contest";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg shadow-xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-400">{entry.name}:</span>
              <span className="text-white font-mono">{formatTime(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-300 font-sans p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#18181b] border border-[#27272a] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-(--c4) blur-[120px] opacity-10 pointer-events-none"></div>

          <div className="flex items-center gap-6 z-10">
            {/* Dynamic Icon and Colors based on Match Result */}
            <div
              className={`p-4 rounded-full ${
                isTie 
                  ? "bg-blue-500/10 text-blue-500" 
                  : isWinner 
                    ? "bg-yellow-500/10 text-yellow-500" 
                    : "bg-red-500/10 text-red-500"
              }`}
            >
              {isTie ? <AlertCircle className="w-10 h-10" /> : <Trophy className="w-10 h-10" />}
            </div>
            <div>
              {/* Dynamic Header Text */}
              <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
                {isTie ? "Match Draw!" : isWinner ? "Victory!" : "Match Defeat"}
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Swords className="w-4 h-4" /> Match vs {opponent.name}
              </p>
            </div>
          </div>

          <div className="flex gap-12 mt-6 md:mt-0 z-10">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
                Your Score
              </p>
              <p className="text-4xl font-mono font-bold text-white">
                {you.score}
              </p>
            </div>
            <div className="w-px bg-[#27272a]"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
                Opponent
              </p>
              <p className="text-4xl font-mono font-bold text-gray-500">
                {opponent.score}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" /> Your Accuracy
              </p>
              <p className="text-2xl font-bold text-white">{you.accuracy}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Opponent</p>
              <p className="text-xl font-bold text-gray-500">
                {opponent.accuracy}%
              </p>
            </div>
          </div>

          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Avg Time / Question
              </p>
              <p className="text-2xl font-bold text-white">{formatTime(you.avgTime)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Opponent</p>
              <p className="text-xl font-bold text-gray-500">
                {formatTime(opponent.avgTime)}
              </p>
            </div>
          </div>
        </div>

        {/* CONTEST ONLY: Problem Breakdown Details */}
        {isContest && questionsBreakdown && questionsBreakdown.length > 0 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-(--c4)" />
              <h2 className="text-xl font-bold text-white">Problem Description</h2>
            </div>
            
            <div className="space-y-6">
              {questionsBreakdown.map((q, idx) => (
                <div key={q.id || idx} className="p-6 rounded-xl border border-[#27272a] bg-[#0f0f0f]">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {q.title || `Problem ${idx + 1}`}
                  </h3>
                  
                  <div className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap text-sm md:text-base font-medium">
                    {q.statement}
                  </div>

                  {q.inputFormat && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Input Format</h4>
                      <div className="text-gray-300 whitespace-pre-wrap text-sm">{q.inputFormat}</div>
                    </div>
                  )}

                  {q.outputFormat && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Output Format</h4>
                      <div className="text-gray-300 whitespace-pre-wrap text-sm">{q.outputFormat}</div>
                    </div>
                  )}

                  {q.constraints && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Constraints</h4>
                      <div className="bg-[#18181b] p-3 rounded-lg border border-[#27272a] font-mono text-sm text-gray-300 inline-block whitespace-pre-wrap">
                        {q.constraints}
                      </div>
                    </div>
                  )}

                  {q.testCases && q.testCases.length > 0 && q.testCases[0].input && (
                    <div className="space-y-4 mt-8">
                      <div className="flex items-center gap-2 mb-2">
                        <TerminalSquare className="w-4 h-4 text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Example Test Case</h4>
                      </div>
                      
                      {q.testCases.map((tc, tcIdx) => (
                        <div key={tcIdx} className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Input</p>
                          <p className="font-mono text-sm text-white mb-3 bg-black/40 p-2 rounded whitespace-pre-wrap">{tc.input}</p>
                          
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Expected Output</p>
                          <p className="font-mono text-sm text-(--c4) bg-black/40 p-2 rounded whitespace-pre-wrap">{tc.output}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTEST ONLY: Submissions Map */}
        {isContest && yourCodeSubmission && opponentCodeSubmission && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="w-5 h-5 text-(--c4)" />
              <h2 className="text-xl font-bold text-white">Code Submissions</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`rounded-xl overflow-hidden border-2 ${yourCodeSubmission.status === "AC" ? "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "border-[#27272a]"}`}
              >
                <div
                  className={`p-4 flex justify-between items-center border-b ${yourCodeSubmission.status === "AC" ? "bg-green-900/10 border-green-500/30" : "bg-[#0f0f0f] border-[#27272a]"}`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      Your Submission
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {yourCodeSubmission.language}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${yourCodeSubmission.status === "AC" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-[#27272a] text-gray-300"}`}
                  >
                    {yourCodeSubmission.status === "AC"
                      ? "Accepted"
                      : yourCodeSubmission.status}
                  </span>
                </div>
                <div className="h-[400px]">
                  <Editor
                    height="100%"
                    language={
                      yourCodeSubmission.language === "cpp"
                        ? "cpp"
                        : yourCodeSubmission.language
                    }
                    theme="vs-dark"
                    value={yourCodeSubmission.code}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border-2 border-[#27272a]">
                <div className="p-4 flex justify-between items-center border-b bg-[#0f0f0f] border-[#27272a]">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      Opponent's Submission
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {opponentCodeSubmission.language}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${opponentCodeSubmission.status === "AC" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-[#27272a] text-gray-300"}`}
                  >
                    {opponentCodeSubmission.status === "AC"
                      ? "Accepted"
                      : opponentCodeSubmission.status}
                  </span>
                </div>
                <div className="h-[400px]">
                  <Editor
                    height="100%"
                    language={
                      opponentCodeSubmission.language === "cpp"
                        ? "cpp"
                        : opponentCodeSubmission.language
                    }
                    theme="vs-dark"
                    value={opponentCodeSubmission.code}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALL MODES: Time Chart */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-8">
            <BarChart2 className="w-5 h-5 text-(--c4)" />
            <h2 className="text-xl font-bold text-white">
              Submission Time Comparison
            </h2>
          </div>

          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#52525b"
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={{ stroke: "#27272a" }}
                />
                <YAxis
                  stroke="#52525b"
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={{ stroke: "#27272a" }}
                  width={75} 
                  tickFormatter={formatTime}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#3f3f46",
                    strokeWidth: 1,
                    strokeDasharray: "5 5",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                <Line
                  type="monotone"
                  name="You"
                  dataKey="youTime"
                  stroke="var(--c4, #f97316)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#18181b", strokeWidth: 2 }}
                  activeDot={{
                    r: 6,
                    fill: "var(--c4, #f97316)",
                    stroke: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  name="Opponent"
                  dataKey="oppTime"
                  stroke="#808080"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#18181b", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NON-CONTEST ONLY (Predict/MCQ): Question Breakdown with colors */}
        {!isContest && questionsBreakdown && questionsBreakdown.length > 0 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Question Breakdown
            </h2>

            <div className="space-y-4">
              {questionsBreakdown.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className={`p-5 rounded-xl border transition-colors ${
                    q.isCorrect
                      ? "bg-green-900/5 border-green-900/20"
                      : "bg-red-900/5 border-red-900/20"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-gray-500 bg-[#0f0f0f] px-2 py-1 rounded border border-[#27272a]">
                          Q{idx + 1}
                        </span>
                        <h3 className="text-white font-medium text-lg leading-relaxed">
                          {q.statement}
                        </h3>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#0f0f0f] p-3 rounded-lg border border-[#27272a]">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Your Answer
                          </p>
                          <p
                            className={`font-mono text-sm flex items-center gap-2 ${q.isCorrect ? "text-green-400" : "text-red-400"}`}
                          >
                            {q.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            {q.yourAnswer || "Not Answered"}
                          </p>
                        </div>

                        <div className="bg-[#0f0f0f] p-3 rounded-lg border border-[#27272a]">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Correct Answer
                          </p>
                          <p className="font-mono text-sm text-gray-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 opacity-50" />
                            {q.actualAnswer}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:text-right flex items-center md:flex-col justify-between md:justify-start gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          q.isCorrect
                            ? "text-green-400 border-green-900/50 bg-green-900/10"
                            : "text-red-400 border-red-900/50 bg-red-900/10"
                        }`}
                      >
                        {q.isCorrect ? "+1 Score" : "0 Score"}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(q.timeTaken)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl font-bold transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;