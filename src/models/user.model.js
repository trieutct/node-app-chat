import mongoose from "mongoose";
import { SCHEMA_NAMES } from "../common/constants.js";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true,
        },
        fullName: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model(SCHEMA_NAMES.USER, userSchema);

export default User;
