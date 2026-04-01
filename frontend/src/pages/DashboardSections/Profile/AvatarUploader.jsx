import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import ImageCropperModal from "./ImageCropperModal";

export default function AvatarUploader({ avatar, onChange }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(URL.createObjectURL(file));
    e.target.value = null;
  };

  return (
    <>
      <label className="relative group cursor-pointer block">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur rounded-full flex items-center justify-center transition">
          <IoMdAdd className="text-orange-500 text-5xl drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
        </div>

        <img
          src={avatar}
          className="h-44 w-44 rounded-full object-cover border-4 border-neutral-900"
        />

        <input type="file" accept="image/*" hidden onChange={onFileChange} />
      </label>

      {selectedImage && (
        <ImageCropperModal
          imageSrc={selectedImage}
          onCancel={() => setSelectedImage(null)}
          onComplete={(cropped) => {
            onChange(cropped);
            setSelectedImage(null);
          }}
        />
      )}
    </>
  );
}
