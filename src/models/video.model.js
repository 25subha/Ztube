import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { User } from "./user.model";

const videoSchema = new Schema({
    videoFile: {
        type: string,
        required: true
    },
    thubmnal: {
        type: string,
        required: true
    },
    title: {
        type: string,
        required: true
    },
    description: {
        type: string,
        required: true
    },
    duration: {
        type: Number,
        requried: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublish: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: User
    }
}, {
    timestamps: true
});

export const Video = mongoose.model("Video", videoSchema)