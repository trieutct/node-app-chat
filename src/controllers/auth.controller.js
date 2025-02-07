import { HttpStatus } from "../common/constants.js";
import {
    ErrorResponse,
    generateToken,
    SuccessResponse,
} from "../utils/api.response.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const singUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        "All fields are required"
                    )
                );
        }

        if (password?.length < 6) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        "Password must be at least 6 characters"
                    )
                );
        }

        const user = await User.findOne({ email });

        if (user) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        "Email already exists"
                    )
                );
        }

        const salt = await bcrypt.genSalt(10);
        //hash password
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);

            await newUser.save();

            res.status(HttpStatus.CREATED).json(
                new SuccessResponse({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                })
            );
        } else {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Invalid user data"
                    )
                );
        }
    } catch (error) {
        console.log(`Error singup: ${error}`.red);
    }
};

export const login = (req, res) => {
    res.send("login route");
};

export const logOut = (req, res) => {
    res.send("logout route");
};
