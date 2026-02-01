"use client";
import { FaBell, FaChartLine, FaHome, FaUser } from "react-icons/fa";
import { FloatingNav } from "./ui/floating-navbar";

const Navbar = () => {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <FaHome />,
    },
    {
      name: "Notifications",
      link: "/notifications",
      icon: <FaBell />,
    },
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <FaChartLine />,
    },
    {
      name: "Profile",
      link: "/profile",
      icon: <FaUser />,
    },
  ];

  return (
    <FloatingNav
      navItems={navItems}
      className="gap-3 fixed top-0 left-0 z-[9999]"
    >
      {/* Profile Avatar */}
      <div className="ml-2">
        <img
          src="https://i.pravatar.cc/40"
          alt="User Profile"
          className="h-9 w-9 rounded-full object-cover border border-neutral-300 dark:border-neutral-700 cursor-pointer"
        />
      </div>
    </FloatingNav>
  );
};

export default Navbar;
