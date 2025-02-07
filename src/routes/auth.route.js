import express from "express";
import {
    checkAuth,
    login,
    logOut,
    singUp,
    updateProfile,
} from "../controllers/auth.controller.js";
import {
    validateSignUp,
    validateLogin,
    validateUpdateProfile,
} from "../validator/auth.validator.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/singup", validateSignUp, singUp);
router.post("/login", validateLogin, login);
router.post("/logout", logOut);

router.put(
    "/update-profile",
    protectRoute,
    validateUpdateProfile,
    updateProfile
);

router.get("/check", protectRoute, checkAuth);

export default router;
