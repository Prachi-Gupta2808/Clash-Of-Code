"use client";
import { FaBell, FaChartLine, FaHome, FaUser } from "react-icons/fa";
import { FloatingNav } from "./ui/floating-navbar";
const fallbackAvatar =
  "https://cutiedp.com/wp-content/uploads/2025/10/anime-orange-pfp.webp";
const Navbar = () => {
  const navItems = [
    { name: "Home", link: "/", icon: <FaHome /> },
    { name: "Alerts", link: "/notifications", icon: <FaBell /> },
    { name: "Stats", link: "/dashboard", icon: <FaChartLine /> },
    { name: "Profile", link: "/profile", icon: <FaUser /> },
  ];

  return (
    <FloatingNav
      navItems={navItems}
      className="gap-1 sm:gap-3 fixed top-0 left-0 z-[9999]"
    >
      <div className="ml-1 sm:ml-2"></div>
    </FloatingNav>
  );
};

export default Navbar;
