const User = require("../models/User.model");

exports.changeUsername = async (req, res) => {
  try {
    let newUsername = req.body.username;
    if (!newUsername) {
      return res.status(400).send({
        msg: "New username is required",
      });
    }

    newUsername = newUsername.trim().toLowerCase() ;
    const id = req.user._id;

    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser && existingUser._id.toString() !== id.toString()) {
      return res.status(409).send({
        msg: "Username already taken",
      });
    }


    await User.findOneAndUpdate(
      { _id: id },
      { $set: { username: newUsername } },
    );

    return res.status(200).send({
      msg: "Username changed successfully",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Username couldn't change",
    });
  }
};
