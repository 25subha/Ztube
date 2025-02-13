import mongoose, { Schema } from "mongoose";
import { Comment } from "./comment.model";
import { Video } from "./video.model";
import { User } from "./user.model";

const likeSchema = new Schema(
    {
        comment: {
            type: Schema.Types.ObjectId,
            ref: Comment
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: Video
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: User
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: Tweet
        }
    },
    { timestamps: true}
)

export const Like = mongoose.model("Like", likeSchema)