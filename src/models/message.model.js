import mongoose from "mongoose";
import { SCHEMA_NAMES } from "../common/constants";

const messgeSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: SCHEMA_NAMES.USER,
            require: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: SCHEMA_NAMES.USER,
            require: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model(SCHEMA_NAMES.MESSAGE, messgeSchema);

export default Message;
