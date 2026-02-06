"use client";

import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6"; // Updated to FaXTwitter
import { Link } from "react-router-dom"; // Using Link for better SEO/UX
import GsapMarquee from "../components/GsapMarquee" ;

const Footer = () => {
  return (
    <div className="">
      <GsapMarquee></GsapMarquee>
      <footer className="w-full bg-[#F2613F] text-black py-12 px-8 md:px-24">
        {/* Top Section: Main Content */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          {/* LEFT: Branding */}
          <div className="flex flex-col gap-4 flex-1">
            <h2 className="text-4xl md:text-5xl poppins-bold-italic tracking-tighter text-black">
              Clash of Code
            </h2>
            <p className="text-white poppins-regular text-lg max-w-sm leading-relaxed">
              Outthink. Outcode. Outrank. Join duels, sharpen your skills, and
              dominate the leaderboard.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5 mt-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-[#F2613F] p-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-[#F2613F] p-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-[#F2613F] p-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* RIGHT: Quick Links */}
          <div className="flex flex-col gap-4 min-w-50">
            <h3 className="text-2xl font-black uppercase tracking-wider mb-2 text-black">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                to="/play"
                className="text-white hover:translate-x-1 hover:text-black font-semibold poppins-regular transition-all duration-200 text-lg"
              >
                Play Now
              </Link>
              <Link
                to="/dashboard"
                className="text-white hover:translate-x-1 hover:text-black font-semibold poppins-regular transition-all duration-200 text-lg"
              >
                Dashboard
              </Link>
              <Link
                to="/contact"
                className="text-white hover:translate-x-1 hover:text-black font-semibold poppins-regular transition-all duration-200 text-lg"
              >
                Contact Us
              </Link>
              <Link
                to="/login"
                className="text-white hover:translate-x-1 hover:text-black font-semibold poppins-regular transition-all duration-200 text-lg"
              >
                Login / Signup
              </Link>
            </nav>
          </div>
        </div>

        {/* BOTTOM: Copyright */}
        <div className="max-w-7xl mx-auto mt-16 border-t-2 border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-black/80 font-medium poppins-regular text-sm">
          <p>
            &copy; {new Date().getFullYear()} Clash of Code. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
