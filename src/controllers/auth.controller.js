import { HttpStatus } from "../common/constants.js";
import {
    ErrorResponse,
    generateToken,
    SuccessResponse,
} from "../utils/api.response.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import cloudianry from "../lib/cloudinary.js";

export const singUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        "All fields are required",
                        errors?.errors || []
                    )
                );
        }
        const { fullName, email, password } = req.body;

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
            const error = {
                key: "email",
                message: "Email already exists",
            };

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        "Email already exists",
                        [error]
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

        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        errors?.errors[0]?.msg || "",
                        errors?.errors || []
                    )
                );
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        "Invalid credentials"
                    )
                );
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        "Invalid credentials"
                    )
                );
        }

        generateToken(user, res);

        res.status(HttpStatus.OK).json(
            new SuccessResponse({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            })
        );
    } catch (error) {
        console.log(`Error login: ${error}`.red);

        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};

export const logOut = (_, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(HttpStatus.OK).json(new SuccessResponse({}));
    } catch (error) {
        console.log(`Error logOut: ${error}`.red);
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};

export const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        HttpStatus.BAD_REQUEST,
                        errors?.errors[0]?.msg || "",
                        errors?.errors || []
                    )
                );
        }

        const { profilePic } = req.body;
        const userId = req.user._id;

        const uploadRes = await cloudianry.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadRes.secure_url },
            {
                new: true,
            }
        );

        res.status(HttpStatus.OK).json(
            new SuccessResponse({
                _id: updateUser._id,
                fullName: updateUser.fullName,
                email: updateUser.email,
                profilePic: updateUser.profilePic,
            })
        );
    } catch (error) {
        console.log(`Error logOut: ${error}`.red);
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(HttpStatus.OK).json(new SuccessResponse(req.user));
    } catch (error) {
        console.log(`Error checkAuth: ${error}`.red);
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};
