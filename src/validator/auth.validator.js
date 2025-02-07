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
