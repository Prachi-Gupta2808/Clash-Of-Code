// src/layouts/AppLayout.jsx
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="relative w-full h-screen bg-[#0C0C0C] overflow-hidden">
      {/* 🔥 FIXED BACKGROUND RIPPLE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundRippleEffect className="w-full h-full" />
      </div>

      {/* 📜 SCROLLABLE CONTENT */}
      <div className="relative z-10 w-full h-screen overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
