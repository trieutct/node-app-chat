import express from "express";
import { login, logOut, singUp } from "../controllers/auth.controller.js";
import { validateSignUp } from "../validator/auth.validator.js";

const router = express.Router();

router.post("/singup", validateSignUp, singUp);

router.post("/login", login);

router.post("/logout", logOut);

export default router;
