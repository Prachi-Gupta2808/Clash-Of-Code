import { useMemo, useState } from "react";

const generateYearData = () => {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const rand = Math.random();
    let count = 0;
    if (rand > 0.8) count = Math.floor(Math.random() * 5);
    if (rand > 0.95) count = Math.floor(Math.random() * 15) + 5;

    data.push({
      date: d,
      dateString: d.toISOString().split("T")[0],
      count: count,
    });
  }
  return data;
};

const getHeatmapColor = (count) => {
  if (count === 0) return "bg-[#161b22]";
  if (count <= 2) return "bg-[#FDBA74]";
  if (count <= 5) return "bg-[#FB923C]";
  if (count <= 10) return "bg-[#F97316]";
  return "bg-[#EA580C]";
};

export default function ContributionGraph() {
  const [hoveredData, setHoveredData] = useState(null);
  const dailyData = useMemo(() => generateYearData(), []);

  const weeks = useMemo(() => {
    const weeksArr = [];
    let currentWeek = Array(7).fill(null);

    dailyData.forEach((dayObj) => {
      const dayOfWeek = dayObj.date.getDay();
      currentWeek[dayOfWeek] = dayObj;
      if (dayOfWeek === 6) {
        weeksArr.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
    });
    if (currentWeek.some((d) => d !== null)) weeksArr.push(currentWeek);
    return weeksArr;
  }, [dailyData]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, index) => {
      const firstDay = week.find((d) => d !== null);
      if (!firstDay) return;
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({
          index,
          label: firstDay.date.toLocaleString("default", { month: "short" }),
        });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="bg-[#0b0f14] p-6 rounded-2xl w-full shadow-lg border border-neutral-800">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-gray-200 text-lg font-semibold">
          Submission History
        </h2>
        <div className="text-xs text-gray-400">
          {dailyData.reduce((acc, curr) => acc + curr.count, 0)} contributions
          in the last year
        </div>
      </div>
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <div className="min-w-max">
          <div className="flex mb-2 text-xs text-gray-400 relative h-4">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                style={{ left: `${m.index * 14}px`, position: "absolute" }}
              >
                {m.label}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-2 text-[10px] text-gray-500 justify-between py-1 h-22.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div className="flex gap-0.75">
              {weeks.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-0.75">
                  {week.map((day, dIndex) => {
                    if (!day)
                      return <div key={dIndex} className="w-2.5 h-2.5" />;
                    return (
                      <div
                        key={dIndex}
                        className={`w-2.5 h-2.5 rounded-[2px] ${getHeatmapColor(
                          day.count,
                        )} transition-all duration-200 hover:ring-1 hover:ring-white hover:z-10 relative group`}
                        onMouseEnter={() => setHoveredData(day)}
                        onMouseLeave={() => setHoveredData(null)}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded pointer-events-none z-20 shadow-xl border border-gray-700">
                          <span className="font-bold text-gray-300">
                            {day.count} submissions
                          </span>
                          <br />
                          <span className="text-gray-400">
                            {new Date(day.date).toDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-end">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-[#161b22]" />
        <div className="w-3 h-3 rounded-sm bg-[#FDBA74]" />
        <div className="w-3 h-3 rounded-sm bg-[#FB923C]" />
        <div className="w-3 h-3 rounded-sm bg-[#F97316]" />
        <div className="w-3 h-3 rounded-sm bg-[#EA580C]" />
        <span>More</span>
      </div>
    </div>
  );
};