import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MatchSummary = () => {
  // Dummy submission time data (in minutes)
  const submissionData = [
    { question: "Q1", player1: 4, player2: 6 },
    { question: "Q2", player1: 7, player2: 5 },
    { question: "Q3", player1: 10, player2: 9 },
    { question: "Q4", player1: 6, player2: 8 },
    { question: "Q5", player1: 12, player2: 11 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-2">{label}</p>

          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm font-semibold"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value} min
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main Graph Card */}
      <div className="bg-neutral-900 rounded-xl p-6 text-white shadow-md border border-neutral-800">
        {/* Heading */}
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-(--c4) rounded-full"></span>
          Match Submission Timeline
        </h3>

        {/* Graph Container */}
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={submissionData}>
              <CartesianGrid
                stroke="#333"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="question"
                stroke="#6b7280"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                stroke="#6b7280"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                label={{
                  value: "Time (minutes)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9ca3af",
                  fontSize: 12,
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend wrapperStyle={{ color: "#9ca3af" }} />

              {/* Player 1 */}
              <Line
                type="monotone"
                dataKey="player1"
                stroke="#481E14"
                strokeWidth={3}
                dot={{ r: 4, fill: "#481E14" }}
                activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
                name="Player 1"
              />

              {/* Player 2 */}
              <Line
                type="monotone"
                dataKey="player2"
                stroke="#F2613F"
                strokeWidth={3}
                dot={{ r: 4, fill: "#F2613F" }}
                activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
                name="Player 2"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optional Lower Cards (match your layout style) */}
      <div className="bg-neutral-900 rounded-xl p-6 mt-6 border border-neutral-800 h-28"></div>
      <div className="bg-neutral-900 rounded-xl p-6 mt-6 border border-neutral-800 h-28"></div>
    </div>
  );
};

export default MatchSummary;
