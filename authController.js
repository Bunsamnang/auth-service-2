import jwt from "jsonwebtoken";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtSecret = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields required." });
  }

  const existingUsername = await userModel.findOne({ username });

  if (existingUsername) {
    res.status(409).json({ message: "Username already exists." });
  }

  const existingEmail = await userModel.findOne({ email });
  if (existingEmail) {
    res.status(409).json({ message: "Email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  // get _id and role of user created
  const { _id, role } = user;

  // to set in jwt
  const userPayloadData = { _id, email, username, role };

  jwt.sign(
    userPayloadData,
    jwtSecret,
    { expiresIn: 24 * 3600 },
    (err, token) => {
      if (err) throw err;
      return res.status(201).json({ token });
    }
  );
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields required." });
  }

  const user = await userModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Invalid credentials." });
  } else {
    // get id and username of found user
    const { _id, username, role } = user;

    const userPayloadData = { _id, username, email, role };

    jwt.sign(
      userPayloadData,
      jwtSecret,
      { expiresIn: 24 * 3600 },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({ token });
      }
    );
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = id;
    if (!isValidObjectId(user_id)) {
      res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await userModel.findById(user_id).exec();

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const { username, email } = user;

    res.status(200).json({ username, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
