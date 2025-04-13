// import crypto from "crypto-js";

import User from "../models/UserModel.js";
import sendToken from "./../utils/sendToken.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill in the required fields.",
    });
  }

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    user = await User.create({
      username,
      email,
      password,
    });

    sendToken(res, user, "Registerd Successfully", 201);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Enter all fields" });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    sendToken(res, user, `Welcome back ${user.name}`, 201);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// fix the code
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};