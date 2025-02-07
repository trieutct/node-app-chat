import express from "express";
import { login, logOut, singUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/singup", singUp);

router.post("/login", login);

router.post("/logout", logOut);

export default router;
