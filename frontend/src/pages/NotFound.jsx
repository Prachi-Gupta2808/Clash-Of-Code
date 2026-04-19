import { useNavigate } from "react-router-dom";
import { TerminalSquare, ArrowLeft, Code2 } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-gray-300 font-sans relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F2613F] blur-[150px] opacity-10 pointer-events-none rounded-full"></div>

      <div className="z-10 flex flex-col items-center max-w-2xl w-full">
        
        <div className="p-4 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-xl mb-8">
          <TerminalSquare className="w-12 h-12 text-[#F2613F]" />
        </div>

        <h1 className="text-8xl md:text-[150px] font-black text-white tracking-tighter leading-none mb-4 drop-shadow-2xl">
          4<span className="text-[#F2613F]">0</span>4
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
          Compilation Error: Route Not Found
        </h2>
        
        <p className="text-gray-400 text-center max-w-md mb-10 text-lg">
          The endpoint you are trying to reach has been dropped from the routing table or never existed.
        </p>

        <div className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-5 mb-10 shadow-2xl relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50"></div>
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#27272a]">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            <span className="ml-2 text-xs text-gray-500 font-mono flex items-center gap-2">
              <Code2 className="w-3 h-3" /> router.js
            </span>
          </div>
          <pre className="font-mono text-sm leading-relaxed overflow-x-auto text-gray-300">
            <span className="text-purple-400">try</span> {"{"}
            <br />
            {"  "}
            <span className="text-blue-400">resolveRoute</span>(window.location.pathname);
            <br />
            {"}"} <span className="text-purple-400">catch</span> (err) {"{"}
            <br />
            {"  "}
            <span className="text-red-400 font-bold">throw new Error</span>(
            <span className="text-green-400">"404: Page Not Found"</span>
            );
            <br />
            {"}"}
          </pre>
        </div>

        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-[#F2613F] hover:bg-[#9B3922] text-white active:scale-[0.98] shadow-[0_0_20px_rgba(242,97,63,0.3)] hover:shadow-[0_0_25px_rgba(242,97,63,0.5)]"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Base
        </button>

      </div>
    </div>
  );
};

export default NotFound;