import { HttpStatus } from "../common/constants.js";
import jwt from "jsonwebtoken";

export class ErrorResponse {
    constructor(
        code = HttpStatus.INTERNAL_SERVER_ERROR,
        message = "",
        errors = []
    ) {
        return {
            code,
            message,
            errors,
        };
    }
}

export const DEFAULT_SUCCESS_MESSAGE = "success";

export class SuccessResponse {
    constructor(data = {}, message = DEFAULT_SUCCESS_MESSAGE) {
        return {
            code: HttpStatus.OK,
            message,
            data,
        };
    }
}

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
};
