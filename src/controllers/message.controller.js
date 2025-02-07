import { HttpStatus } from "../common/constants";
import cloudianry from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { ErrorResponse, SuccessResponse } from "../utils/api.response";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filtersUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");

        res.status(HttpStatus.OK).json(new SuccessResponse(filtersUsers));
    } catch (error) {
        console.log(`Error getUsersForSidebar: ${error}`.red);
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};

export const getMesssages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {
                    senderId: myId,
                    receiverId: userToChatId,
                },
                {
                    senderId: userToChatId,
                    receiverId: myId,
                },
            ],
        });

        res.status(HttpStatus.OK).json(new SuccessResponse(messages));
    } catch (error) {
        console.log(`Error getUsersForSidebar: ${error}`.red);
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};

// TODO: validate form
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req?.user?._id;

        let imageUrl;

        if (image) {
            const uploadRes = await cloudianry.uploader.upload(image);
            imageUrl = uploadRes.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // TODO: realtime funtion goes herre=>socket.io

        res.status(HttpStatus.CREATED).json(new SuccessResponse(newMessage));
    } catch (error) {
        console.log(`Error sendMessage: ${error}`.red);
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error));
    }
};
