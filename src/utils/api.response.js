import { HttpStatus } from "../common/constants.js";
import jwt from "jsonwebtoken";

const removeDuplicateErrors = (errors) => {
    const seenKeys = new Set();
    return errors.filter((error) => {
        if (seenKeys.has(error.key)) {
            return false; // Nếu đã thấy key, loại bỏ
        }
        seenKeys.add(error.key); // Thêm key vào Set
        return true; // Giữ lại lỗi đầu tiên
    });
};

const convertErrors = (errors, errorCode) => {
    const formattedErrors = errors.map((error) => {
        if (
            error.type === "field" &&
            error.path &&
            error.msg &&
            error.location
        ) {
            return {
                key: error.path,
                message: error.msg,
                error: errorCode,
            };
        }
        return error;
    });

    return removeDuplicateErrors(formattedErrors);
};

export class ErrorResponse {
    constructor(
        code = HttpStatus.INTERNAL_SERVER_ERROR,
        message = "",
        errors = []
    ) {
        return {
            code,
            message,
            errors: convertErrors(errors, code),
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
