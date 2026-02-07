const multer = require("multer");
const supabase = require("../libs/supabase");
const sharp = require("sharp");
const User = require("../models/User.model");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8-MBs
});

exports.uploadAvatar = [
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const webpBuffer = await sharp(file.buffer)
        .resize(256, 256, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer();
      const filePath = `${userId}.webp`;

      await supabase.storage.from("avatars").remove([filePath]); // If file exists delete it; no error if file doesn't exist

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, webpBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

      await User.findByIdAndUpdate(userId, {
        avatar: avatarUrl,
      });

      res.status(200).json({
        message: "Profile picture uploaded",
        avatar: data.publicUrl,
      });
    } catch (error) {
      console.log("Error in uploadAvatar controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
