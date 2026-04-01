import Cropper from "react-easy-crop";
import { IoMdClose } from "react-icons/io";
import { useState, useCallback } from "react";
import { getCroppedImg } from "./cropImage";

export default function ImageCropperModal({
  imageSrc,
  onCancel,
  onComplete,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedPixels(pixels);
  }, []);

  const handleSave = async () => {
    const cropped = await getCroppedImg(imageSrc, croppedPixels);
    onComplete(cropped);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-neutral-900 w-full max-w-lg rounded-xl overflow-hidden border border-neutral-800">
        <header className="flex justify-between p-4 border-b border-neutral-800">
          <h3 className="text-white font-semibold">Edit Avatar</h3>
          <button onClick={onCancel}>
            <IoMdClose className="text-gray-400 hover:text-white" />
          </button>
        </header>

        <div className="relative h-72 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="p-4 space-y-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full accent-orange-500"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-300 hover:bg-neutral-800 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-white text-black rounded"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
