import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: User
        }
    },
    {timestamps: true})

    export const Tweet = mongoose.model("Tweet", tweetSchema)