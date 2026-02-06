"use client";

import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const SocialLink = ({ href, label, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-[#F2613F] transition-colors"
    aria-label={label}
  >
    {icon}
  </a>
);

const PhotoCard = ({ photo, socialLinks, name }) => (
  <motion.div
    className="flex flex-col items-center w-full md:w-auto"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    {/* Photo with your original 3D hover effect */}
    <div
      className="perspective transition-transform duration-200 ease-out group w-64 sm:w-72 md:w-80"
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xNorm = (x / rect.width - 0.5) * 2;
        const yNorm = (y / rect.height - 0.5) * 2;

        card.style.transform = `
          perspective(1000px)
          rotateX(${-yNorm * 12}deg)
          rotateY(${xNorm * 12}deg)
          scale(1.05)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          scale(1)
        `;
      }}
    >
      <img
        src={photo}
        alt={name}
        className="w-full h-80 sm:h-88 md:h-96 object-cover rounded-2xl shadow-xl object-bottom
                   group-hover:grayscale transition-all duration-500 pointer-events-none"
      />
    </div>

    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
      {socialLinks.map((link) => (
        <SocialLink
          key={link.label}
          href={link.href}
          label={link.label}
          icon={link.icon}
        />
      ))}
    </div>
  </motion.div>
);

export default function TwoPhotos() {
  const socialLinks = [
    [
      {
        href: "mailto:prachig2808@gmail.com",
        label: "Email",
        icon: <FaEnvelope />,
      },
      {
        href: "https://www.linkedin.com/in/prachi-gupta-74122a324",
        label: "LinkedIn",
        icon: <FaLinkedin />,
      },
      {
        href: "https://github.com/Prachi-Gupta2808",
        label: "GitHub",
        icon: <FaGithub />,
      },
    ],
    [
      {
        href: "mailto:jangiryash04@gmail.com",
        label: "Email",
        icon: <FaEnvelope />,
      },
      {
        href: "https://www.linkedin.com/in/yashjangir04",
        label: "LinkedIn",
        icon: <FaLinkedin />,
      },
      {
        href: "https://github.com/yashjangir04",
        label: "GitHub",
        icon: <FaGithub />,
      },
    ],
  ];

  return (
    <main className="min-h-screen text-white flex justify-center items-center px-4 sm:px-6 md:px-16 pt-20 md:pt-24 gap-12 md:gap-24">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
        {/* Your photo */}
        <PhotoCard
          photo="/pic_prachi.jpeg"
          name="Prachi Gupta"
          socialLinks={socialLinks[0]}
        />

        <PhotoCard
          photo="/pic_yash.jpg"
          name="Yash Jangir"
          socialLinks={socialLinks[1]}
        />
      </div>
    </main>
  );
}
