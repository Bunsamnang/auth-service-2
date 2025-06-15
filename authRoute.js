import express from "express";
import { getAllUsers, getUserInfo, login, signup } from "./authController.js";
import { verifyAdmin } from "./verifyAdmin.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user/:id", getUserInfo);
router.get("/user/", verifyAdmin, getAllUsers);

export default router;
