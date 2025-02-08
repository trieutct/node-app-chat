import { body } from "express-validator";

export const validateSignUp = [
    body("fullName")
        .isString()
        .isLength({ min: 3 })
        .withMessage(
            "Full name is required and must be at least 3 characters long."
        ),
    body("email").isEmail().withMessage("A valid email is required."),
    body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage(
            "Password is required and must be at least 6 characters long."
        ),
];

export const validateLogin = [
    body("email").isEmail().withMessage("A valid email is required."),
    body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage(
            "Password is required and must be at least 6 characters long."
        ),
];

export const validateUpdateProfile = [
    body("profilePic")
        .exists()
        .withMessage("Profile picture data is required.")
        .isString()
        .withMessage("Profile picture must be a string.")
        .matches(/^data:image\/[a-zA-Z]+;base64,.*$/)
        .withMessage("A valid base64 string for the profile picture is required."),
];
