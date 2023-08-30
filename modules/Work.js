
import mongoose from "mongoose";


const WorkModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: [],
    },
    url: String,
    imageUrl: String,

}, {
    timestamps: true
})


export default mongoose.model('Work', WorkModel);