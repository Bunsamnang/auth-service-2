import express from "express";
import { getUserInfo, login, signup } from "./authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user/:id", getUserInfo);

export default router;
