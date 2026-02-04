"use client";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBell,
  IconHistory,
  IconUserBolt,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";

import FriendsSection from "./DashboardSections/FriendsSection";
import MatchSection from "./DashboardSections/MatchSection";
import NotificationSection from "./DashboardSections/NotificationSection";
import ProfileSection from "./DashboardSections/ProfileSection";
import { MdLogout } from "react-icons/md";
import { useAuth } from "@/auth/AuthContext";
import { logout } from "../api/auth";
import { socket } from "@/components/socket/socket";

const Dashboard = () => {
  const { user , setUser } = useAuth() ;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
      socket.disconnect() ;
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  const links = [
    {
      label: "Profile",
      icon: <IconUserBolt className="h-5 w-5" />,
      onClick: () => setActiveSection("profile"),
    },
    {
      label: "Friends",
      icon: <IconUsers className="h-5 w-5" />,
      onClick: () => setActiveSection("friends"),
    },
    {
      label: "Notifications",
      icon: <IconBell className="h-5 w-5" />,
      onClick: () => setActiveSection("notifications"),
    },
    {
      label: "Matches History",
      icon: <IconHistory className="h-5 w-5" />,
      onClick: () => setActiveSection("matches"),
    },
    {
      label: "Logout",
      icon: <MdLogout className="h-5 w-5 text-red-500" />,
      onClick: handleLogout,
    },
  ];

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-neutral-900"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-6">
          <div className="flex flex-col gap-2">
            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-4 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 p-8 overflow-y-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          {activeSection === "profile" && <ProfileSection user={user} />}
          {activeSection === "friends" && <FriendsSection />}
          {activeSection === "notifications" && <NotificationSection />}
          {activeSection === "matches" && <MatchSection />}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

/* ================= LOGO ================= */

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-3 text-white cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        src="/logo.png"
        alt="Clash Of Code"
        className="h-13 w-13 object-contain"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold whitespace-nowrap text-xl  "
      >
        Clash Of Code
      </motion.span>
    </div>
  );
};

const LogoIcon = () => (
  <motion.img
    src="/logo.png"
    alt="Clash Of Code"
    className="h-12 w-12 object-contain mx-auto"
    initial={{ scale: 0.9 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.2 }}
  />
);
