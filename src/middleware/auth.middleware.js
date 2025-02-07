import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { HttpStatus } from "../common/constants.js";
import { ErrorResponse } from "../utils/api.response.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(HttpStatus.UNAUTHORIZED).json(
                new ErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "UNAUTHORIZED"
                )
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(HttpStatus.UNAUTHORIZED).json(
                new ErrorResponse(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED")
            );
        }

        const user = await User.findById(decoded.userId)
            .select("-password")
            .exec();
        if (!user) {
            res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(HttpStatus.NOT_FOUND, "User not found")
            );
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(`Error protectRoute: ${error}`.red);
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};
