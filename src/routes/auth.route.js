import express from "express";
import { login, logOut, singUp } from "../controllers/auth.controller.js";
import { validateSignUp, validateLogin } from "../validator/auth.validator.js";

const router = express.Router();

router.post("/singup", validateSignUp, singUp);

router.post("/login", validateLogin, login);

router.post("/logout", logOut);

export default router;
