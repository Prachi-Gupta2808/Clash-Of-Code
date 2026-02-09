import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { IoMdAdd, IoMdClose, IoMdCheckmark } from "react-icons/io";
import Cropper from "react-easy-crop";
import ContributionGraph from "./Profile/ContributionGraph";
// import { uploadAvatar } from "@/api/auth"; // Unused import removed
import axios from "axios";
import { FiEdit } from "react-icons/fi";

// --- 1. Canvas Utils for Cropping ---
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) return null;

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
}

// --- 2. Crop Modal Component ---
const ImageCropperModal = ({ imageSrc, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Crop failed");

      const formData = new FormData();
      formData.append("image", croppedBlob, "profile.jpg");

      await axios.post(
        "http://localhost:5000/api/upload/avatar",
        formData,
        { withCredentials: true }
      );

      window.location.reload();
    } catch (err) {
      console.error("Upload failed:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f1218] w-full max-w-lg rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col h-125">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="text-white font-semibold text-lg">Edit Media</h3>
          <button onClick={onCancel} disabled={isLoading} className="text-gray-400 hover:text-white transition cursor-pointer">
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="relative flex-1 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            showGrid={false}
          />
        </div>
        <div className="p-4 bg-[#0f1218] border-t border-gray-800 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-medium">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              disabled={isLoading}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={onCancel} disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition">
              Cancel
            </button>
            <button onClick={handleSave} disabled={isLoading} className="px-6 py-2 rounded-lg text-sm font-medium bg-(--c4) text-white hover:bg-(--c3) cursor-pointer transition flex items-center gap-2">
              {isLoading ? "Saving..." : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const sampleRatingDeltas = [0, 15, 24, -12, 45, -30, 10, 80, 12, -5, 35, 60, -100, 45, 20];
const STARTING_RATING = 800;

const ProfileSection = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [username, setUsername] = useState("@" + (user?.username || "username"));
  const [inputDisabled, setInputDisabled] = useState(true);
  const [isSavingUser, setIsSavingUser] = useState(false);
  
  const fileInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setSelectedImage(imageDataUrl);
      e.target.value = null;
    }
  };

  const handleUserChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEditClick = () => {
    setInputDisabled(false);
    setTimeout(() => usernameInputRef.current?.focus(), 0);
  };

  const handleCancelEdit = () => {
    setUsername("@" + (user?.username || "username"));
    setInputDisabled(true);
  };

  const handleSaveUsername = async () => {
    if (!username || username.trim() === "@") return;
    
    setIsSavingUser(true);
    try {
      const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

      await axios.post(
        "http://localhost:5000/api/change/username", 
        { username: cleanUsername },
        { withCredentials: true }
      );

      setInputDisabled(true);
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to update username", error);
      alert("Error updating username");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !inputDisabled) {
      handleSaveUsername();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const ratingData = useMemo(() => {
    let currentRating = STARTING_RATING;
    return sampleRatingDeltas.map((delta, index) => {
      currentRating += delta;
      return {
        matchIndex: index,
        matchLabel: index === 0 ? "Start" : `Contest ${index}`,
        rating: currentRating,
        delta: delta,
      };
    });
  }, []);

  const CustomGraphTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{data.matchLabel}</p>
          <p className="text-white font-bold text-base">
            Rating: <span className="text-(--c4)">{data.rating}</span>
          </p>
          {data.matchIndex !== 0 && (
            <p className={`text-xs font-semibold mt-1 ${data.delta >= 0 ? "text-green-500" : "text-red-500"}`}>
              Change: {data.delta > 0 ? "+" : ""}{data.delta}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Profile Card */}
          <div className="bg-neutral-900 rounded-xl p-6 w-full lg:w-1/3 text-white shadow-md border border-neutral-800">
            <div className="flex flex-col items-center">
              
              {/* Avatar Upload */}
              <label className="relative group cursor-pointer block mb-4">
                <div className="darkCircle absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[5px] z-10 rounded-full flex justify-center items-center duration-300">
                  <IoMdAdd className="text-orange-500 text-5xl scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 duration-200 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                </div>
                <div className="absolute -inset-0.5 bg-linear-to-r from-orange-600 to-amber-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <img
                  src={user?.avatar || "https://riqieznxfrbdfcyfoxss.supabase.co/storage/v1/object/public/avatars/defaultPic.webp"}
                  alt={user?.fullName}
                  className="relative z-0 h-44 w-44 rounded-full object-cover border-4 border-neutral-900"
                />
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileChange} />
              </label>

              {/* User Details */}
              <div className="text-center w-full flex flex-col items-center gap-1">
                
                {/* 1. Name - REVERTED TO ORIGINAL STYLE */}
                <h2 className="text-3xl font-bold">
                  {user?.fullName || "User Name"}
                </h2>
                
                {/* 2. Title - REVERTED TO ORIGINAL STYLE */}
                <p className="text-xl text-(--c4) font-mono mt-1">
                  {user?.title || "Specialist"}
                </p>
                
                {/* 3. Username: UPDATED IMPROVED LAYOUT */}
                <div 
                  className={`
                    group/edit relative flex items-center justify-center gap-2 
                    px-3 py-1.5 rounded-lg transition-all duration-200
                    ${!inputDisabled ? "bg-neutral-800 w-full max-w-60 border border-neutral-700" : "hover:bg-neutral-800/50 cursor-pointer"}
                  `}
                  onClick={inputDisabled ? handleEditClick : undefined}
                >
                  <input
                    ref={usernameInputRef}
                    type="text"
                    className={`
                      text-sm font-medium outline-none bg-transparent text-center w-full
                      ${inputDisabled ? "text-gray-400 cursor-pointer pointer-events-none" : "text-white"}
                    `}
                    onChange={handleUserChange}
                    onKeyDown={handleKeyDown}
                    value={username}
                    disabled={inputDisabled || isSavingUser}
                    spellCheck={false}
                  />
                  
                  {/* Buttons */}
                  <div className="flex items-center">
                    {inputDisabled ? (
                      <FiEdit 
                        size={14} 
                        className="text-gray-500 opacity-0 group-hover/edit:opacity-100 transition-opacity -ml-4" 
                      />
                    ) : (
                      <div className="flex gap-1 ml-1 pl-2 border-l border-neutral-700">
                        <button 
                          className="cursor-pointer text-emerald-500 hover:text-emerald-400 transition p-1 hover:bg-neutral-700 rounded-md"
                          onClick={(e) => { e.stopPropagation(); handleSaveUsername(); }}
                          disabled={isSavingUser}
                          title="Save"
                        >
                           <IoMdCheckmark size={16} />
                        </button>
                        <button 
                          className="cursor-pointer text-rose-500 hover:text-rose-400 transition p-1 hover:bg-neutral-700 rounded-md"
                          onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                          disabled={isSavingUser}
                          title="Cancel"
                        >
                           <IoMdClose size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="w-full h-px bg-neutral-800 my-2"></div>

              {/* Stats */}
              <div className="flex justify-between w-full px-4 text-sm">
                <div className="text-center">
                  <span className="block font-bold text-lg text-white">{ratingData[ratingData.length - 1].rating}</span>
                  <span className="text-gray-500">Rating</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-lg text-white">453</span>
                  <span className="text-gray-500">Solved</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-lg text-white">Top 5%</span>
                  <span className="text-gray-500">Rank</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Section */}
          <div className="bg-neutral-900 rounded-xl p-6 w-full lg:w-2/3 text-white shadow-md border border-neutral-800 flex flex-col">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-(--c4) rounded-full"></span>
              Rating Progress
            </h3>
            <div className="flex-1 min-h-62.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingData}>
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="matchIndex" stroke="#6b7280" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} tickFormatter={(val) => (val === 0 ? "" : `#${val}`)} />
                  <YAxis stroke="#6b7280" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} domain={[800, "auto"]} />
                  <Tooltip content={<CustomGraphTooltip />} cursor={{ stroke: "#374151", strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="rating" stroke="#d95b3d" strokeWidth={3} dot={{ r: 4, fill: "#d95b3d", strokeWidth: 0 }} activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <ContributionGraph />
      </div>

      {selectedImage && (
        <ImageCropperModal
          imageSrc={selectedImage}
          onCancel={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

export default ProfileSection;